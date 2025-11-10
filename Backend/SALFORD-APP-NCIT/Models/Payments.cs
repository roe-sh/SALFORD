using System;
using System.Collections.Generic;

namespace SALFORD_APP_NCIT.Models;

public partial class Payments
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public decimal Amount { get; set; }

    public DateTime? PaymentDate { get; set; }

    public string? PaymentMethod { get; set; }

    public string? ReferenceId { get; set; }

    public virtual ICollection<Subscriptions> Subscriptions { get; set; } = new List<Subscriptions>();

    public virtual Users User { get; set; } = null!;
}
