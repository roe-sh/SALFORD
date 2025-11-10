namespace SALFORD_APP_NCIT.DTOs
{
    // DTO used when creating or updating a category
    public class CategoryRequestDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
    }

    // DTO used when returning category data to client
    public class CategoryResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
