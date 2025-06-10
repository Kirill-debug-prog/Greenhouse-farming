using Greenhouse_farming.Models.DTO;
using Greenhouse_farming.Models.Entity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Greenhouse_farming.Controllers
{
    [ApiController]
    [Route("api/greenhouses")]
    [Produces("application/json")]
    public class GreenhouseController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<GreenhouseController> _logger;

        public GreenhouseController(AppDbContext context, ILogger<GreenhouseController> logger)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<object>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<object>>> GetGreenhouses()
        {
            try
            {
                // Получаем все теплицы
                var greenhouses = await _context.greenhouses
                    .Include(g => g.sensordata)
                    .Include(g => g.cultures)
                    .ToListAsync();

                var result = greenhouses.Select(g =>
                {
                    var latestData = g.sensordata.OrderByDescending(s => s.timestamp).FirstOrDefault();

                    return new GreenhouseDto
                    {
                        Id = g.greenhousenumber,
                        Name = g.name,
                        Culture = g.cultures.FirstOrDefault()?.name ?? "—", // Предполагается, что в теплице может быть одна культура
                        //Image = "tomatoes", // можно заменить
                        Temperature = latestData?.temperature?.ToString("F1"),
                        Humidity = latestData?.humidity?.ToString("F0"),
                        Lighting = latestData != null? (latestData.lighting == true ? "Вкл" : "Выкл") : "—",
                        LightLevel = latestData?.lightlevel?.ToString("F0"),
                        Status = latestData != null ? "ok" : "offline"
                    };
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении списка теплиц.");
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "Ошибка при получении списка теплиц." });
            }
        }

        
    }
}
