using Greenhouse_farming.Models.DTO;
using Greenhouse_farming.Models.Entity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Greenhouse_farming.Controllers
{
    [ApiController]
    [Route("api/workings")]
    [Produces("application/json")]
    public class WorkingController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<WorkingController> _logger;

        public WorkingController(AppDbContext context, ILogger<WorkingController> logger)
        {
            _context = context;
            _logger = logger;
        }

        //Получить теплицы по культуре
        [HttpGet("greenhouses-for-culture/{cultureId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetGreenhousesForCulture(int cultureId)
        {
            var greenhouses = await _context.culture_Greenhouses
                .Where(cg => cg.cultureid == cultureId)
                .Include(cg => cg.greenhouse)
                .Select(cg => new
                {
                    cg.greenhousenumber,
                    GreenhouseName = cg.greenhouse.name
                })
                .ToListAsync();

            return Ok(greenhouses);
        }

        //Получение задач по теплице
        [HttpGet("greenhouse/{id}")]
        public async Task<ActionResult<IEnumerable<object>>> GetWorkingsByGreenhouse(int id)
        {
            var workings = await _context.workings
                .Where(w => w.greenhousenumber == id)
                .Include(w => w.greenhousenumberNavigation)
                .Include(w => w.type)
                .Include(w => w.resourceusages)
                    .ThenInclude(ru => ru.resource)
                        .ThenInclude(r => r.unit)
                .Select(w => new
                {
                    w.workingid,
                    w.plannedstartdatetime,
                    w.plannedenddatetime,
                    GreenhouseName = w.greenhousenumberNavigation.name,
                    Type = w.type.type,
                    Resources = w.resourceusages.Select(ru => new
                    {
                        ResourceId = ru.resourceid,
                        ResourceName = ru.resource.name,
                        ru.resource.noteone,
                        ru.resource.notetwo,
                        Unit = ru.resource.unit.unit1,
                        ru.amountused
                    }).ToList()
                }).ToListAsync();

            return Ok(workings);
        }

        [HttpPost("create")]
        public async Task<ActionResult> CreateWorkingForCulture([FromBody] CreateWorkingForCultureDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Приводим даты к Kind = Unspecified для PostgreSQL (timestamp without time zone)
            dto.PlannedStart = DateTime.SpecifyKind(dto.PlannedStart, DateTimeKind.Unspecified);
            dto.PlannedEnd = DateTime.SpecifyKind(dto.PlannedEnd, DateTimeKind.Unspecified);

            // Проверка наличия культуры, теплицы и типа работы
            var cultureExists = await _context.cultures.AnyAsync(c => c.cultureid == dto.CultureId);
            var greenhouseExists = await _context.greenhouses.AnyAsync(g => g.greenhousenumber == dto.GreenhouseNumber);
            var typeExists = await _context.typeworkings.AnyAsync(t => t.typeid == dto.TypeId);

            if (!cultureExists || !greenhouseExists || !typeExists)
            {
                return NotFound(new { Message = "Культура, теплица или тип работы не найдены." });
            }

            if (dto.PlannedStart >= dto.PlannedEnd)
            {
                return BadRequest(new { Message = "Дата начала должна быть раньше даты окончания." });
            }

            // Проверка на конфликт по времени в теплице
            var hasConflict = await _context.workings.AnyAsync(w =>
                w.greenhousenumber == dto.GreenhouseNumber &&
                w.plannedstartdatetime <= dto.PlannedEnd &&
                w.plannedenddatetime >= dto.PlannedStart);

            if (hasConflict)
            {
                return Conflict(new { Message = "На выбранный период уже запланирована работа в этой теплице." });
            }

            // Создание новой работы
            var working = new working
            {
                greenhousenumber = dto.GreenhouseNumber,
                typeid = dto.TypeId,
                plannedstartdatetime = dto.PlannedStart,
                plannedenddatetime = dto.PlannedEnd
            };

            _context.workings.Add(working);
            await _context.SaveChangesAsync();

            // Получаем тип работы по ID
            var typeName = await _context.typeworkings
                .Where(t => t.typeid == dto.TypeId)
                .Select(t => t.type)
                .FirstOrDefaultAsync();

            // Обработка ресурсов
            foreach (var res in dto.Resources)
            {
                // Ищем существующий ресурс
                var existingResource = await _context.resourcetypes.FirstOrDefaultAsync(r =>
                    r.name == res.Name &&
                    r.noteone == res.NoteOne &&
                    r.notetwo == res.NoteTwo &&
                    r.unitid == res.UnitId);

                resourcetype resource = existingResource;

                if (existingResource == null)
                {
                    // Создаем новый ресурс
                    resource = new resourcetype
                    {
                        name = res.Name,
                        noteone = res.NoteOne,
                        notetwo = res.NoteTwo,
                        unitid = res.UnitId
                    };

                    _context.resourcetypes.Add(resource);
                    await _context.SaveChangesAsync(); // чтобы получить resource.resourceid
                }

                // Бизнес-валидация в зависимости от типа работы
                if (typeName == "Полив" && string.IsNullOrEmpty(resource.noteone))
                {
                    return BadRequest(new { Message = $"Для полива необходимо указать метод (NoteOne) для ресурса {resource.name}." });
                }

                if (typeName == "Удобрение" && (string.IsNullOrEmpty(resource.noteone) || string.IsNullOrEmpty(resource.notetwo)))
                {
                    return BadRequest(new { Message = $"Для удобрения необходимо указать тип и метод применения для ресурса {resource.name}." });
                }

                // Создаем запись об использовании ресурса
                var resourceUsage = new resourceusage
                {
                    workingid = working.workingid,
                    resourceid = resource.resourceid,
                    amountused = res.AmountUsed
                };

                _context.resourceusages.Add(resourceUsage);
            }

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetWorkingsByGreenhouse), new { id = working.greenhousenumber }, new
            {
                workingId = working.workingid,
                greenhouseNumber = working.greenhousenumber,
                type = typeName,
                plannedStart = working.plannedstartdatetime,
                plannedEnd = working.plannedenddatetime
            });
        }



        [HttpGet("actual-usage/{workingId}")]
        public async Task<ActionResult<IEnumerable<ActualUsageDto>>> GetActualResourceUsage(int workingId)
        {
            var workingExists = await _context.workings.AnyAsync(w => w.workingid == workingId);
            if (!workingExists)
            {
                return NotFound(new { Message = $"Работа с ID {workingId} не найдена." });
            }

            var actualUsages = await _context.actualresourceusages
                .Where(aru => aru.workingid == workingId)
                .Include(aru => aru.resource)
                    .ThenInclude(r => r.unit)
                .ToListAsync();

            if (actualUsages.Count == 0)
            {
                return NotFound(new { Message = "Актуальные данные не найдены." });
            }

            return Ok(actualUsages.Select(ToDto));
        }


        [HttpPost("actual-usage/{workingId}")]
        public async Task<ActionResult<IEnumerable<ActualUsageDto>>> CreateActualResourceUsage(
        int workingId,
        [FromBody] List<ActualUsageInputDto> inputUsages)
        {
            var working = await _context.workings
                .Include(w => w.resourceusages)
                    .ThenInclude(ru => ru.resource)
                        .ThenInclude(r => r.unit)
                .FirstOrDefaultAsync(w => w.workingid == workingId);

            if (working == null)
            {
                return NotFound(new { Message = $"Работа с ID {workingId} не найдена." });
            }

            var existingActualUsages = await _context.actualresourceusages
                .AnyAsync(aru => aru.workingid == workingId);

            if (existingActualUsages)
            {
                return Conflict(new { Message = "Актуальные данные уже существуют." });
            }

            var newActualUsages = new List<actualresourceusage>();

            foreach (var input in inputUsages)
            {
                var resourceUsage = working.resourceusages
                    .FirstOrDefault(ru => ru.resource.name == input.ResourceName);

                if (resourceUsage == null)
                {
                    return BadRequest(new { Message = $"Ресурс '{input.ResourceName}' не найден в плане." });
                }

                newActualUsages.Add(new actualresourceusage
                {
                    workingid = workingId,
                    resourceid = resourceUsage.resourceid,
                    amountactualused = input.AmountActualUsed
                });
            }

            await _context.actualresourceusages.AddRangeAsync(newActualUsages);
            await _context.SaveChangesAsync();

            var createdUsages = await _context.actualresourceusages
                .Where(aru => aru.workingid == workingId)
                .Include(aru => aru.resource)
                    .ThenInclude(r => r.unit)
                .ToListAsync();

            return CreatedAtAction(
                nameof(GetActualResourceUsage),
                new { workingId },
                createdUsages.Select(ToDto));
        }



        private ActualUsageDto ToDto(actualresourceusage aru)
            {
                return new ActualUsageDto
                {
                    ResourceName = aru.resource.name,
                    AmountActualUsed = aru.amountactualused,
                    Unit = aru.resource.unit.unit1
                };
            }
        }
}
