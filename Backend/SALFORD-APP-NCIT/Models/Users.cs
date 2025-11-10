using System;
using System.Collections.Generic;

namespace SALFORD_APP_NCIT.Models;

public partial class Users
{
    public int Id { get; set; }

    public string FullName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string? PasswordHash { get; set; }

    public string Role { get; set; } = null!;

    public string? SubscriptionStatus { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<Notifications> Notifications { get; set; } = new List<Notifications>();

    public virtual ICollection<Payments> Payments { get; set; } = new List<Payments>();

    public virtual ICollection<Subscriptions> Subscriptions { get; set; } = new List<Subscriptions>();
}
