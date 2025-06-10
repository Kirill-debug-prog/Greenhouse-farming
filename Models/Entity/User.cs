using System;
using System.Collections.Generic;

namespace Greenhouse_farming.Models.Entity;

public partial class User
{
    public int userid { get; set; }

    public string login { get; set; } = null!;

    public string passwordhash { get; set; } = null!;

    //public string salt { get; set; } = null!;

    public int? roleid { get; set; }

    public virtual person? person { get; set; }

    public virtual userrole? role { get; set; }
}
