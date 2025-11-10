using System;
using System.Collections.Generic;

namespace SALFORD_APP_NCIT.Models;

public partial class Subscriptions
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int CourseId { get; set; }

    public int? PaymentId { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public string? Status { get; set; }

    public virtual Courses Course { get; set; } = null!;

    public virtual Payments? Payment { get; set; }

    public virtual Users User { get; set; } = null!;
}
