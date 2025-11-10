using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SALFORD_APP_NCIT.DTOs;
using SALFORD_APP_NCIT.Models;
using System.Security.Claims;

namespace SALFORD_APP_NCIT.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LessonsController : ControllerBase
    {
        private readonly SalfordContext _context;
        private readonly IWebHostEnvironment _env;

        public LessonsController(SalfordContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // ===========================================================
        // GET: api/Lessons?courseId=5
        // Public — list all lessons or filter by courseId
        // Adds full public URL for each video
        // ===========================================================
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LessonResponseDto>>> GetLessons([FromQuery] int? courseId)
        {
            var baseUrl = $"{Request.Scheme}://{Request.Host}";

            var query = _context.Lessons
                .Include(l => l.Course)
                .AsQueryable();

            if (courseId.HasValue)
                query = query.Where(l => l.CourseId == courseId.Value);

            var lessons = await query
                .OrderBy(l => l.LessonOrder)
                .Select(l => new LessonResponseDto
                {
                    Id = l.Id,
                    Title = l.Title,
                    VideoUrl = string.IsNullOrEmpty(l.VideoUrl)
                        ? null
                        : (l.VideoUrl.StartsWith("http")
                            ? l.VideoUrl
                            : $"{baseUrl}/{l.VideoUrl.Replace("\\", "/")}"),
                    Duration = l.Duration ?? 0,
                    LessonOrder = l.LessonOrder,
                    CourseId = l.CourseId,
                    CourseTitle = l.Course.Title,
                    CreatedAt = l.CreatedAt ?? DateTime.MinValue
                })
                .ToListAsync();

            return Ok(lessons);
        }

        // ===========================================================
        // GET: api/Lessons/5
        // Public — get lesson by ID with absolute video URL
        // ===========================================================
        [HttpGet("{id}")]
        public async Task<ActionResult<LessonResponseDto>> GetLesson(int id)
        {
            var baseUrl = $"{Request.Scheme}://{Request.Host}";

            var lesson = await _context.Lessons
                .Include(l => l.Course)
                .FirstOrDefaultAsync(l => l.Id == id);

            if (lesson == null)
                return NotFound(new { message = "Lesson not found" });

            var dto = new LessonResponseDto
            {
                Id = lesson.Id,
                Title = lesson.Title,
                VideoUrl = string.IsNullOrEmpty(lesson.VideoUrl)
                    ? null
                    : (lesson.VideoUrl.StartsWith("http")
                        ? lesson.VideoUrl
                        : $"{baseUrl}/{lesson.VideoUrl.Replace("\\", "/")}"),
                Duration = lesson.Duration ?? 0,
                LessonOrder = lesson.LessonOrder,
                CourseId = lesson.CourseId,
                CourseTitle = lesson.Course?.Title ?? "Unknown",
                CreatedAt = lesson.CreatedAt ?? DateTime.MinValue
            };

            return Ok(dto);
        }

        // ===========================================================
        // PUT: api/Lessons/{id}/progress
        // Optional authenticated route for progress tracking
        // ===========================================================
        [Authorize]
        [HttpPut("{id}/progress")]
        public async Task<IActionResult> UpdateLessonProgress(int id, [FromBody] LessonProgressDto request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized(new { message = "User not found" });

            var lesson = await _context.Lessons.FindAsync(id);
            if (lesson == null)
                return NotFound(new { message = "Lesson not found" });

            // 🧠 placeholder for actual progress persistence logic
            Console.WriteLine($"User {userId} watched lesson {id}, progress: {request.Progress}%");

            return Ok(new { message = "Progress updated successfully" });
        }

        private bool LessonExists(int id)
        {
            return _context.Lessons.Any(e => e.Id == id);
        }
    }
}
