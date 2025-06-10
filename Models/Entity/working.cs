using System;
using System.Collections.Generic;

namespace Greenhouse_farming.Models.Entity;

public partial class working
{
    public int workingid { get; set; }

    public DateTime? plannedstartdatetime { get; set; }

    public DateTime? plannedenddatetime { get; set; }

    public DateTime? actualstartdatetime { get; set; }

    public DateTime? actualenddatetime { get; set; }

    public int typeid { get; set; }

    public int greenhousenumber { get; set; }

    public virtual ICollection<actualresourceusage> actualresourceusages { get; set; } = new List<actualresourceusage>();

    public virtual greenhouse greenhousenumberNavigation { get; set; } = null!;

    public virtual ICollection<resourceusage> resourceusages { get; set; } = new List<resourceusage>();

    public virtual typeworking type { get; set; } = null!;
}
