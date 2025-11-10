namespace SALFORD_APP_NCIT.DTOs
{
    public class UserProfileDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string? SubscriptionStatus { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int TotalCourses { get; set; }
        public int ActiveCourses { get; set; }
    }
}
