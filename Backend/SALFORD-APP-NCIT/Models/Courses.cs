using System;
using System.Collections.Generic;

namespace SALFORD_APP_NCIT.Models;

public partial class Courses
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public int CategoryId { get; set; }

    public decimal Price { get; set; }

    public string? ImageUrl { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Categories Category { get; set; } = null!;

    public virtual ICollection<Lessons> Lessons { get; set; } = new List<Lessons>();

    public virtual ICollection<Notifications> Notifications { get; set; } = new List<Notifications>();

    public virtual ICollection<Subscriptions> Subscriptions { get; set; } = new List<Subscriptions>();
}
