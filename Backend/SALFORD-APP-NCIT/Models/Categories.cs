using System;
using System.Collections.Generic;

namespace SALFORD_APP_NCIT.Models;

public partial class Categories
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<Courses> Courses { get; set; } = new List<Courses>();
}
