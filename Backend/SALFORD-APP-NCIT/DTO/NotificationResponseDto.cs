namespace SALFORD_APP_NCIT.DTOs
{
    public class NotificationResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public int? CourseId { get; set; }
        public int? LessonId { get; set; }
        public bool IsRead { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
}
