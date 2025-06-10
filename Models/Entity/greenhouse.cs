using System;
using System.Collections.Generic;

namespace Greenhouse_farming.Models.Entity;

public partial class greenhouse
{
    public int greenhousenumber { get; set; }

    public string name { get; set; } = null!;

    public virtual ICollection<sensordatum> sensordata { get; set; } = new List<sensordatum>();

    public virtual ICollection<sensordata_aggregate> sensordata_aggregates { get; set; } = new List<sensordata_aggregate>();

    public virtual ICollection<working> workings { get; set; } = new List<working>();

    public virtual ICollection<culture> cultures { get; set; } = new List<culture>();
}
