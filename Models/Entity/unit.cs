using System;
using System.Collections.Generic;

namespace Greenhouse_farming.Models.Entity;

public partial class unit
{
    public int unitid { get; set; }

    public string unit1 { get; set; } = null!;

    public virtual ICollection<resourcetype> resourcetypes { get; set; } = new List<resourcetype>();
}
