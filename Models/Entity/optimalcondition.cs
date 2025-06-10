using System;
using System.Collections.Generic;

namespace Greenhouse_farming.Models.Entity;

public partial class optimalcondition
{
    public int cultureid { get; set; }

    public double temp { get; set; }

    public double humidity { get; set; }

    public double lightlevel { get; set; }

    public virtual culture culture { get; set; } = null!;
}
