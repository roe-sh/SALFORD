using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SALFORD_APP_NCIT.DTOs;
using SALFORD_APP_NCIT.Models;

namespace SALFORD_APP_NCIT.Controllers
{
    [Route("api/admin/courses")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminCoursesController : ControllerBase
    {
        private readonly SalfordContext _context;
        private readonly IWebHostEnvironment _env;

        public AdminCoursesController(SalfordContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // ===========================================================
        // GET: api/admin/courses
        // ===========================================================
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CourseResponseDto>>> GetCourses()
        {
            var courses = await _context.Courses
                .Include(c => c.Category)
                .OrderByDescending(c => c.CreatedAt)
                .Select(c => new CourseResponseDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    Description = c.Description,
                    Price = c.Price,
                    ImageUrl = c.ImageUrl,
                    CategoryName = c.Category != null ? c.Category.Name : "Uncategorised",
                    CreatedAt = c.CreatedAt ?? DateTime.MinValue
                })
                .ToListAsync();

            return Ok(courses);
        }

        // ===========================================================
        // GET: api/admin/courses/{id}
        // ===========================================================
        [HttpGet("{id:int}")]
        public async Task<ActionResult<CourseResponseDto>> GetCourse(int id)
        {
            var course = await _context.Courses
                .Include(c => c.Category)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (course == null)
                return NotFound(new { message = "Course not found" });

            return Ok(new CourseResponseDto
            {
                Id = course.Id,
                Title = course.Title,
                Description = course.Description,
                Price = course.Price,
                ImageUrl = course.ImageUrl,
                CategoryName = course.Category != null ? course.Category.Name : "Uncategorised",
                CreatedAt = course.CreatedAt ?? DateTime.MinValue
            });

        }

        // ===========================================================
        // POST: api/admin/courses/create
        // Supports multipart/form-data uploads
        // ===========================================================
        [HttpPost("create")]
        [RequestSizeLimit(long.MaxValue)]
        public async Task<IActionResult> CreateCourse([FromForm] CourseRequestDto dto, IFormFile? imageFile)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var category = await _context.Categories.FindAsync(dto.CategoryId);
            if (category == null)
                return BadRequest("Invalid category");

            string? imageUrl = dto.ImageUrl;

            if (imageFile != null && imageFile.Length > 0)
            {
                var projectRoot = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, @"..\..\..\"));
                var uploadsFolder = Path.Combine(projectRoot, "wwwroot", "uploads", "images");

                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(imageFile.FileName)}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                Console.WriteLine($"[UPLOAD] Saving to: {filePath}");

                await using var stream = new FileStream(filePath, FileMode.Create);
                await imageFile.CopyToAsync(stream);

                // ✅ build full public URL
                imageUrl = $"{Request.Scheme}://{Request.Host}/uploads/images/{fileName}";
                Console.WriteLine($"[UPLOAD] Public URL: {imageUrl}");
            }

            var course = new Course
            {
                Title = dto.Title,
                Description = dto.Description,
                CategoryId = dto.CategoryId,
                Price = dto.Price,
                ImageUrl = imageUrl,
                CreatedAt = DateTime.UtcNow
            };

            _context.Courses.Add(course);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Course created successfully", course.Id });
        }

        // ===========================================================
        // PUT: api/admin/courses/{id}
        // ===========================================================
        [HttpPut("{id:int}")]
        [RequestSizeLimit(long.MaxValue)]
        public async Task<IActionResult> UpdateCourse(int id, [FromForm] CourseRequestDto dto, IFormFile? imageFile)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null)
                return NotFound(new { message = "Course not found" });

            course.Title = dto.Title;
            course.Description = dto.Description;
            course.CategoryId = dto.CategoryId;
            course.Price = dto.Price;

            if (imageFile != null && imageFile.Length > 0)
            {
                var projectRoot = Directory.GetCurrentDirectory();
                var uploadsFolder = Path.Combine(projectRoot, "wwwroot", "uploads", "images");

                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(imageFile.FileName)}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                Console.WriteLine($"[UPLOAD] Updating image: {filePath}");

                await using var stream = new FileStream(filePath, FileMode.Create);
                await imageFile.CopyToAsync(stream);

                course.ImageUrl = $"{Request.Scheme}://{Request.Host}/uploads/images/{fileName}";
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Course updated successfully" });
        }

        // ===========================================================
        // DELETE: api/admin/courses/{id}
        // ===========================================================
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteCourse(int id)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null)
                return NotFound(new { message = "Course not found" });

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Course deleted successfully" });
        }
    }
}
