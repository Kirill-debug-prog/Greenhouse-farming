namespace Greenhouse_farming.Models.DTO
{
    public class CultureCardDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public string Season { get; set; }
        public int AmountHarvested { get; set; }

        public List<string> Greenhouses { get; set; } = new();
    }
}
