using System;
using System.Collections.Generic;

namespace SALFORD_APP_NCIT.Models;

public partial class Notification
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string Title { get; set; } = null!;

    public string Message { get; set; } = null!;

    public int? CourseId { get; set; }

    public int? LessonId { get; set; }

    public bool? IsRead { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Course? Course { get; set; }

    public virtual Lesson? Lesson { get; set; }

    public virtual User User { get; set; } = null!;
}
