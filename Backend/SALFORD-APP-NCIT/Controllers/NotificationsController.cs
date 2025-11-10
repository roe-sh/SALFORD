using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SALFORD_APP_NCIT.DTOs;
using SALFORD_APP_NCIT.Models;

namespace SALFORD_APP_NCIT.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationsController : ControllerBase
    {
        private readonly SalfordContext _context;

        public NotificationsController(SalfordContext context)
        {
            _context = context;
        }

        // ===========================================================
        // GET: api/Notifications
        // Returns notifications for the logged-in user
        // ===========================================================
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<NotificationResponseDto>>> GetNotifications()
        {
            var userIdClaim = User.FindFirst("id")?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized(new { message = "Invalid or missing token" });

            var userId = int.Parse(userIdClaim);

            var notifications = await _context.Notifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .Select(n => new NotificationResponseDto
                {
                    Id = n.Id,
                    Title = n.Title,
                    Message = n.Message,
                    CourseId = n.CourseId,
                    LessonId = n.LessonId,
                    IsRead = n.IsRead ?? false,
                    CreatedAt = n.CreatedAt
                })
                .ToListAsync();

            return Ok(notifications);
        }

        // ===========================================================
        // PUT: api/Notifications/{id}/read
        // Marks a single notification as read
        // ===========================================================
        [Authorize]
        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var userIdClaim = User.FindFirst("id")?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized(new { message = "Invalid or missing token" });

            var userId = int.Parse(userIdClaim);

            var notification = await _context.Notifications
                .FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);

            if (notification == null)
                return NotFound(new { message = "Notification not found" });

            notification.IsRead = true;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Notification marked as read" });
        }

        // ===========================================================
        // DELETE: api/Notifications/{id}
        // Deletes a notification (user or admin)
        // ===========================================================
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotification(int id)
        {
            var userIdClaim = User.FindFirst("id")?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized(new { message = "Invalid or missing token" });

            var userId = int.Parse(userIdClaim);

            var notification = await _context.Notifications
                .FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);

            if (notification == null)
                return NotFound(new { message = "Notification not found" });

            _context.Notifications.Remove(notification);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Notification deleted successfully" });
        }

        // ===========================================================
        // POST: api/Notifications
        // (Admin only) Create a new notification manually
        // ===========================================================
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateNotification(NotificationRequestDto request)
        {
            if (!await _context.Users.AnyAsync(u => u.Id == request.UserId))
                return BadRequest(new { message = "Invalid user ID" });

            var notification = new Notification
            {
                UserId = request.UserId,
                Title = request.Title,
                Message = request.Message,
                CourseId = request.CourseId,
                LessonId = request.LessonId,
                IsRead = false,
                CreatedAt = DateTime.Now
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Notification created successfully" });
        }
    }
}
