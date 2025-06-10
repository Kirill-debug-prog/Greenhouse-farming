using System;
using System.Collections.Generic;

namespace Greenhouse_farming.Models.Entity;

public partial class culture
{
    public int cultureid { get; set; }

    public string name { get; set; } = null!;

    public string type { get; set; } = null!;

    public string? season { get; set; } = null!;

    public int? amountharvested { get; set; }

    public virtual optimalcondition? optimalcondition { get; set; }

    public virtual ICollection<greenhouse> greenhousenumbers { get; set; } = new List<greenhouse>();
}
