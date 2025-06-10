namespace Greenhouse_farming.Models.DTO
{
    public class CreateWorkingDto
    {
        public int CultureId { get; set; }
        public int GreenhouseNumber { get; set; }
        public int TypeId { get; set; }
        public DateTime PlannedStart { get; set; }
        public DateTime PlannedEnd { get; set; }

        public List<ResourceUsageDto> Resources { get; set; }
    }
}
