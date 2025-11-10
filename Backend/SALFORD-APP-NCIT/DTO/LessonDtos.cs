namespace SALFORD_APP_NCIT.DTOs
{
    // DTO for creating or updating a lesson
    public class LessonRequestDto
    {
        public string Title { get; set; } = string.Empty;
        public string? VideoUrl { get; set; }
        public int Duration { get; set; }           // in minutes
        public int CourseId { get; set; }
        public int LessonOrder { get; set; } = 1;
    }


}
