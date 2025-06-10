namespace Greenhouse_farming.Models.DTO
{
    public class CreateCultureDto
    {
        public string Name { get; set; } = null!;
        public string Type { get; set; } = null!;

        public OptimalConditionsDto OptimalConditions { get; set; } = null!;
    }
}
