namespace SALFORD_APP_NCIT.DTOs
{
    public class NotificationRequestDto
    {
        public int UserId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public int? CourseId { get; set; }
        public int? LessonId { get; set; }
    }
}
