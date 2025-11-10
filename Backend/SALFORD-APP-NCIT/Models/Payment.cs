using System;
using System.Collections.Generic;

namespace SALFORD_APP_NCIT.Models;

public partial class Payment
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public decimal Amount { get; set; }

    public DateTime? PaymentDate { get; set; }

    public string? PaymentMethod { get; set; }

    public string? ReferenceId { get; set; }

    public virtual ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();

    public virtual User User { get; set; } = null!;
}
