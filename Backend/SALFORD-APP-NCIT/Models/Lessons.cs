using System;
using System.Collections.Generic;

namespace SALFORD_APP_NCIT.Models;

public partial class Lessons
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public string? VideoUrl { get; set; }

    public int? Duration { get; set; }

    public int CourseId { get; set; }

    public int LessonOrder { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Courses Course { get; set; } = null!;

    public virtual ICollection<Notifications> Notifications { get; set; } = new List<Notifications>();
}
