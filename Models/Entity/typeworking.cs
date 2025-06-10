using System;
using System.Collections.Generic;

namespace Greenhouse_farming.Models.Entity;

public partial class typeworking
{
    public int typeid { get; set; }

    public string type { get; set; } = null!;

    public virtual ICollection<working> workings { get; set; } = new List<working>();
}
