using System;
using System.Collections.Generic;

namespace SALFORD_APP_NCIT.Models;

public partial class User
{
    public int Id { get; set; }

    public string FullName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public string Role { get; set; } = null!;

    public string? SubscriptionStatus { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();

    public virtual ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();
}
