namespace Greenhouse_farming.Models.DTO
{
    public class CreateWorkingForCultureDto
    {
        public int CultureId { get; set; }
        public int GreenhouseNumber { get; set; }
        public int TypeId { get; set; }
        public DateTime PlannedStart { get; set; }
        public DateTime PlannedEnd { get; set; }

        public List<ResourceDto> Resources { get; set; }
    }
}
