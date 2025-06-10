namespace Greenhouse_farming.Models.DTO
{
    public class ResourceUsageDto
    {
        public int ResourceId { get; set; }
        public double AmountUsed { get; set; }

        // Дополнительные поля для определённых типов работ
        public string? Noteone { get; set; }
        public string? Notetwo { get; set; }
    }
}
