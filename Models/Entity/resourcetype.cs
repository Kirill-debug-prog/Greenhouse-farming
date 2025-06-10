using System;
using System.Collections.Generic;

namespace Greenhouse_farming.Models.Entity;

public partial class resourcetype
{
    public int resourceid { get; set; }

    public string name { get; set; } = null!;

    public string noteone { get; set; } = null!;

    public string? notetwo { get; set; }

    public int unitid { get; set; }

    public virtual ICollection<actualresourceusage> actualresourceusages { get; set; } = new List<actualresourceusage>();

    public virtual ICollection<resourceusage> resourceusages { get; set; } = new List<resourceusage>();

    public virtual unit unit { get; set; } = null!;
}
