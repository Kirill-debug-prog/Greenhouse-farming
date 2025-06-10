using Greenhouse_farming.Models.DTO;
using Greenhouse_farming.Models.Entity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Greenhouse_farming.Controllers
{
    [ApiController]
    [Route("api/cultures")]
    [Produces("application/json")]
    public class CultureController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<CultureController> _logger;

        public CultureController(AppDbContext context, ILogger<CultureController> logger)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<object>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<object>>> GetCultures(
        [FromQuery] int? greenhouseNumber,
        [FromQuery] string? name,
        [FromQuery] string? type)
        {
            try
            {
                _logger.LogInformation("Получение списка культур с фильтрами: greenhouseNumber={Greenhouse}, name={Name}, type={Type}",
                    greenhouseNumber, name, type);

                var query = _context.cultures
                    .Include(c => c.greenhousenumbers)
                    .AsQueryable();

                if (greenhouseNumber.HasValue)
                    query = query.Where(c => c.greenhousenumbers.Any(g => g.greenhousenumber == greenhouseNumber.Value));

                if (!string.IsNullOrWhiteSpace(name))
                    query = query.Where(c => c.name.ToLower().Contains(name.ToLower()));

                if (!string.IsNullOrWhiteSpace(type))
                    query = query.Where(c => c.type.ToLower().Contains(type.ToLower()));

                var result = await query.Select(c => new
                {
                    c.cultureid,
                    c.name,
                    c.type,
                    Greenhouses = c.greenhousenumbers.Select(g => g.name).ToList()
                }).ToListAsync();

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении списка культур.");
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "Ошибка при получении списка культур." });
            }
        }

        // GET: api/cultures/{id}
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<object>> GetCultureById(int id)
        {
            try
            {
                _logger.LogInformation("Запрос на получение культуры по ID: {Id}", id);

                var culture = await _context.cultures
                .Include(c => c.greenhousenumbers)
                .Include(c => c.optimalcondition)
                .FirstOrDefaultAsync(c => c.cultureid == id);


                if (culture == null)
                {
                    return NotFound(new { Message = $"Культура с ID={id} не найдена." });
                }

                var result = new
                {
                    culture.cultureid,
                    culture.name,
                    culture.type,
                    Greenhouses = culture.greenhousenumbers.Select(g => g.name).ToList(),
                    OptimalConditions = culture.optimalcondition == null ? null : new
                    {
                        culture.optimalcondition.temp,
                        culture.optimalcondition.humidity,
                        culture.optimalcondition.lightlevel
                    },
                    culture.amountharvested
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении культуры по ID: {Id}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "Ошибка при получении культуры." });
            }
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> CreateCulture([FromBody] CreateCultureDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                //Создаем культуру
                var newCulture = new culture
                {
                    name = dto.Name,
                    type = dto.Type,
                };

                _context.cultures.Add(newCulture);
                await _context.SaveChangesAsync();

                var optimal = new optimalcondition
                {
                    cultureid = newCulture.cultureid,
                    temp = dto.OptimalConditions.Temp,
                    humidity = dto.OptimalConditions.Humidity,
                    lightlevel = dto.OptimalConditions.LightLevel,
                };

                _context.optimalconditions.Add(optimal);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetCultureById), new { id = newCulture.cultureid }, new { id = newCulture.cultureid });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при создании культуры.");
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "Ошибка при создании культуры." });
            }
        }
    }
}
