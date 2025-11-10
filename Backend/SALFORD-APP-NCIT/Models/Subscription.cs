using System;
using System.Collections.Generic;

namespace SALFORD_APP_NCIT.Models;

public partial class Subscription
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int CourseId { get; set; }

    public int? PaymentId { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public string? Status { get; set; }

    public virtual Course Course { get; set; } = null!;

    public virtual Payment? Payment { get; set; }

    public virtual User User { get; set; } = null!;
}
