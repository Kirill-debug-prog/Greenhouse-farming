using System;
using System.Collections.Generic;

namespace Greenhouse_farming.Models.Entity;

public partial class person
{
    public int personid { get; set; }

    public string lastname { get; set; } = null!;

    public string firstname { get; set; } = null!;

    public string? email { get; set; }

    public int? userid { get; set; }

    public virtual User? user { get; set; }
}
