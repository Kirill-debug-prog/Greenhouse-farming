using System.ComponentModel.DataAnnotations.Schema;

namespace Greenhouse_farming.Models.Entity
{
    [Table("culture_greenhouse")]
    public class Culture_Greenhouse
    {
        public int greenhousenumber { get; set; }
        public int cultureid { get; set; }

        public greenhouse greenhouse { get; set; }
        public culture culture { get; set; }
    }
}
