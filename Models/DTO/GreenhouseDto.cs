namespace Greenhouse_farming.Models.DTO
{
    public class GreenhouseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Culture { get; set; }
        //public string Image { get; set; } = null!;
        public string Temperature { get; set; } = "—";
        public string Humidity { get; set; } = "—";
        public string Lighting { get; set; } = "—";
        public string LightLevel { get; set; } = "—";
        public string Status { get; set; } = "no data";
    }
}
