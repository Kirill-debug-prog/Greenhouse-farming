using System;
using System.Collections.Generic;

namespace Greenhouse_farming.Models.Entity;

public partial class actualresourceusage
{
    public int workingid { get; set; }

    public int resourceid { get; set; }

    public double amountactualused { get; set; }

    public virtual resourcetype resource { get; set; } = null!;

    public virtual working working { get; set; } = null!;
}
