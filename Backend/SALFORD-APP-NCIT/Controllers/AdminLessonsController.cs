using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SALFORD_APP_NCIT.DTOs;
using SALFORD_APP_NCIT.Models;

namespace SALFORD_APP_NCIT.Controllers
{
    [Route("api/admin/lessons")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminLessonsController : ControllerBase
    {
        private readonly SalfordContext _context;
        private readonly IWebHostEnvironment _env;

        public AdminLessonsController(SalfordContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // ===========================================================
        // GET: api/admin/lessons?courseId=5
        // ===========================================================
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LessonResponseDto>>> GetLessons([FromQuery] int? courseId)
        {
            var query = _context.Lessons.Include(l => l.Course).AsQueryable();

            if (courseId.HasValue)
                query = query.Where(l => l.CourseId == courseId.Value);

            var lessons = await query
                .OrderBy(l => l.LessonOrder)
                .Select(l => new LessonResponseDto
                {
                    Id = l.Id,
                    Title = l.Title,
                    VideoUrl = l.VideoUrl,
                    Duration = l.Duration ?? 0,
                    LessonOrder = l.LessonOrder,
                    CourseId = l.CourseId,
                    CourseTitle = l.Course != null ? l.Course.Title : "Unknown",
                    CreatedAt = l.CreatedAt ?? DateTime.MinValue
                })
                .ToListAsync();

            return Ok(lessons);
        }

        // ===========================================================
        // GET: api/admin/lessons/{id}
        // ===========================================================
        [HttpGet("{id:int}")]
        public async Task<ActionResult<LessonResponseDto>> GetLesson(int id)
        {
            var lesson = await _context.Lessons
                .Include(l => l.Course)
                .FirstOrDefaultAsync(l => l.Id == id);

            if (lesson == null)
                return NotFound(new { message = "Lesson not found" });

            return Ok(new LessonResponseDto
            {
                Id = lesson.Id,
                Title = lesson.Title,
                VideoUrl = lesson.VideoUrl,
                Duration = lesson.Duration ?? 0,
                LessonOrder = lesson.LessonOrder,
                CourseId = lesson.CourseId,
                CourseTitle = lesson.Course != null ? lesson.Course.Title : "Unknown",
                CreatedAt = lesson.CreatedAt ?? DateTime.MinValue
            });
        }

        // ===========================================================
        // POST: api/admin/lessons/create
        // Supports multipart/form-data for video uploads
        // ===========================================================
        [HttpPost("create")]
        public async Task<IActionResult> CreateLesson([FromForm] LessonRequestDto dto, IFormFile? videoFile)
        {
            var course = await _context.Courses.FindAsync(dto.CourseId);
            if (course == null)
                return BadRequest("Invalid course");

            string? videoUrl = dto.VideoUrl;

            if (videoFile != null && videoFile.Length > 0)
            {
                var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads", "videos");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(videoFile.FileName)}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                await using var stream = new FileStream(filePath, FileMode.Create);
                await videoFile.CopyToAsync(stream);

                videoUrl = $"{Request.Scheme}://{Request.Host}/uploads/videos/{fileName}";
            }

            var lesson = new Lesson
            {
                Title = dto.Title,
                VideoUrl = videoUrl,
                Duration = dto.Duration,
                LessonOrder = dto.LessonOrder,
                CourseId = dto.CourseId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Lessons.Add(lesson);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Lesson created successfully", lesson.Id });
        }

        // ===========================================================
        // PUT: api/admin/lessons/{id}
        // ===========================================================
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateLesson(int id, [FromForm] LessonRequestDto dto, IFormFile? videoFile)
        {
            var lesson = await _context.Lessons.FindAsync(id);
            if (lesson == null)
                return NotFound(new { message = "Lesson not found" });

            lesson.Title = dto.Title;
            lesson.Duration = dto.Duration;
            lesson.LessonOrder = dto.LessonOrder;
            lesson.CourseId = dto.CourseId;

            if (videoFile != null && videoFile.Length > 0)
            {
                var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads", "videos");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(videoFile.FileName)}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                await using var stream = new FileStream(filePath, FileMode.Create);
                await videoFile.CopyToAsync(stream);

                lesson.VideoUrl = $"{Request.Scheme}://{Request.Host}/uploads/videos/{fileName}";
            }
            else
            {
                lesson.VideoUrl = dto.VideoUrl;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Lesson updated successfully" });
        }

        // ===========================================================
        // DELETE: api/admin/lessons/{id}
        // ===========================================================
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteLesson(int id)
        {
            var lesson = await _context.Lessons.FindAsync(id);
            if (lesson == null)
                return NotFound(new { message = "Lesson not found" });

            _context.Lessons.Remove(lesson);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Lesson deleted successfully" });
        }
    }
}
