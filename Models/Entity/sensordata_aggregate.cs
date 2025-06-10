using System;
using System.Collections.Generic;

namespace Greenhouse_farming.Models.Entity;

public partial class sensordata_aggregate
{
    public DateTime periodstart { get; set; }

    public DateTime periodend { get; set; }

    public int greenhousenumber { get; set; }

    public double avgtemperature { get; set; }

    public double maxhumidity { get; set; }

    public double minlightlevel { get; set; }

    public virtual greenhouse greenhousenumberNavigation { get; set; } = null!;
}
