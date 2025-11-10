using System;
using System.Collections.Generic;

namespace SALFORD_APP_NCIT.Models;

public partial class Course
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public int CategoryId { get; set; }

    public decimal Price { get; set; }

    public string? ImageUrl { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Category Category { get; set; } = null!;

    public virtual ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    public virtual ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();
}
