namespace SALFORD_APP_NCIT.DTOs
{
    // Request DTO for creating or updating a course
    public class CourseRequestDto
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int CategoryId { get; set; }
        public decimal Price { get; set; }
        public string? ImageUrl { get; set; }
    }

    // Response DTO for returning courses to clients
    public class CourseResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public string? ImageUrl { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
