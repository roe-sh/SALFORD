using System;
using System.Collections.Generic;

namespace SALFORD_APP_NCIT.Models;

public partial class Notifications
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string Title { get; set; } = null!;

    public string Message { get; set; } = null!;

    public int? CourseId { get; set; }

    public int? LessonId { get; set; }

    public bool? IsRead { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Courses? Course { get; set; }

    public virtual Lessons? Lesson { get; set; }

    public virtual Users User { get; set; } = null!;
}
