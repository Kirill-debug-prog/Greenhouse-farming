using System;
using System.Collections.Generic;

namespace Greenhouse_farming.Models.Entity;

public partial class sensordatum
{
    public DateTime timestamp { get; set; }

    public int greenhousenumber { get; set; }

    public double? temperature { get; set; }

    public double? humidity { get; set; }

    public double? lightlevel { get; set; }

    public bool? lighting { get; set; }

    public virtual greenhouse greenhousenumberNavigation { get; set; } = null!;
}
