using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SALFORD_APP_NCIT.DTOs;
using SALFORD_APP_NCIT.Models;

namespace SALFORD_APP_NCIT.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoursesController : ControllerBase
    {
        private readonly SalfordContext _context;
        private readonly IWebHostEnvironment _env;

        public CoursesController(SalfordContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // ===========================================================
        // GET: api/Courses
        // Public — list all or filter by category
        // Returns absolute URLs for stored images
        // ===========================================================
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CourseResponseDto>>> GetCourses([FromQuery] int? categoryId)
        {
            try
            {
                var baseUrl = $"{Request.Scheme}://{Request.Host}";

                var query = _context.Courses
                    .Include(c => c.Category)
                    .AsQueryable();

                if (categoryId.HasValue)
                    query = query.Where(c => c.CategoryId == categoryId.Value);

                var courses = await query
                    .OrderByDescending(c => c.CreatedAt)
                    .Select(c => new CourseResponseDto
                    {
                        Id = c.Id,
                        Title = c.Title,
                        Description = c.Description,
                        Price = c.Price,
                        ImageUrl = string.IsNullOrEmpty(c.ImageUrl)
                            ? null
                            : (c.ImageUrl.StartsWith("http")
                                ? c.ImageUrl
                                : $"{baseUrl}/{c.ImageUrl.Replace("\\", "/")}"),
                        CategoryName = c.Category != null ? c.Category.Name : "Uncategorised",
                        CreatedAt = c.CreatedAt ?? DateTime.MinValue
                    })
                    .ToListAsync();

                return Ok(courses);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving courses", error = ex.Message });
            }
        }

        // ===========================================================
        // GET: api/Courses/{id}
        // Public — view details by ID
        // ===========================================================
        [HttpGet("{id}")]
        public async Task<ActionResult<CourseResponseDto>> GetCourse(int id)
        {
            try
            {
                var baseUrl = $"{Request.Scheme}://{Request.Host}";

                var course = await _context.Courses
                    .Include(c => c.Category)
                    .FirstOrDefaultAsync(c => c.Id == id);

                if (course == null)
                    return NotFound(new { message = "Course not found" });

                var dto = new CourseResponseDto
                {
                    Id = course.Id,
                    Title = course.Title,
                    Description = course.Description,
                    Price = course.Price,
                    ImageUrl = string.IsNullOrEmpty(course.ImageUrl)
                        ? null
                        : (course.ImageUrl.StartsWith("http")
                            ? course.ImageUrl
                            : $"{baseUrl}/{course.ImageUrl.Replace("\\", "/")}"),
                    CategoryName = course.Category != null ? course.Category.Name : "Uncategorised",
                    CreatedAt = course.CreatedAt ?? DateTime.MinValue
                };

                return Ok(dto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving course", error = ex.Message });
            }
        }

        // ===========================================================
        // GET: api/Courses/trending
        // Public — top 5 newest courses
        // ===========================================================
        [HttpGet("trending")]
        public async Task<ActionResult<IEnumerable<CourseResponseDto>>> GetTrendingCourses()
        {
            var baseUrl = $"{Request.Scheme}://{Request.Host}";

            var courses = await _context.Courses
                .Include(c => c.Category)
                .OrderByDescending(c => c.CreatedAt)
                .Take(5)
                .Select(c => new CourseResponseDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    Description = c.Description,
                    Price = c.Price,
                    ImageUrl = string.IsNullOrEmpty(c.ImageUrl)
                        ? null
                        : (c.ImageUrl.StartsWith("http")
                            ? c.ImageUrl
                            : $"{baseUrl}/{c.ImageUrl.Replace("\\", "/")}"),
                    CategoryName = c.Category != null ? c.Category.Name : "Uncategorised",
                    CreatedAt = c.CreatedAt ?? DateTime.MinValue
                })
                .ToListAsync();

            return Ok(courses);
        }

        // ===========================================================
        // GET: api/Courses/popular
        // Public — top 5 by price or enrolments (demo metric)
        // ===========================================================
        [HttpGet("popular")]
        public async Task<ActionResult<IEnumerable<CourseResponseDto>>> GetPopularCourses()
        {
            var baseUrl = $"{Request.Scheme}://{Request.Host}";

            var courses = await _context.Courses
                .Include(c => c.Category)
                .OrderByDescending(c => c.Price)
                .Take(5)
                .Select(c => new CourseResponseDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    Description = c.Description,
                    Price = c.Price,
                    ImageUrl = string.IsNullOrEmpty(c.ImageUrl)
                        ? null
                        : (c.ImageUrl.StartsWith("http")
                            ? c.ImageUrl
                            : $"{baseUrl}/{c.ImageUrl.Replace("\\", "/")}"),
                    CategoryName = c.Category != null ? c.Category.Name : "Uncategorised",
                    CreatedAt = c.CreatedAt ?? DateTime.MinValue
                })
                .ToListAsync();

            return Ok(courses);
        }
    }
}
