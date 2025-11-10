namespace SALFORD_APP_NCIT.DTOs
{
    public class LessonResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string VideoUrl { get; set; } = string.Empty;
        public int Duration { get; set; }
        public int LessonOrder { get; set; }
        public int CourseId { get; set; }
        public string CourseTitle { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
