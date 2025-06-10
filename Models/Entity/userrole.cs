using System;
using System.Collections.Generic;

namespace Greenhouse_farming.Models.Entity;

public partial class userrole
{
    public int roleid { get; set; }

    public string rolename { get; set; } = null!;

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
