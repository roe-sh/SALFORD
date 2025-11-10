using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SALFORD_APP_NCIT.DTOs;
using SALFORD_APP_NCIT.Models;

namespace SALFORD_APP_NCIT.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserProfileController : ControllerBase
    {
        private readonly SalfordContext _context;

        public UserProfileController(SalfordContext context)
        {
            _context = context;
        }

        // ===========================================================
        // GET: api/UserProfile
        // Returns logged-in user profile
        // ===========================================================
        [HttpGet]
        public async Task<ActionResult<UserProfileDto>> GetProfile()
        {
            var userIdClaim = User.FindFirst("id")?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized(new { message = "Invalid token or missing user ID" });

            var userId = int.Parse(userIdClaim);

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound(new { message = "User not found" });

            var totalCourses = await _context.Subscriptions.CountAsync(s => s.UserId == userId);
            var activeCourses = await _context.Subscriptions.CountAsync(s => s.UserId == userId && s.Status == "Active");

            var profile = new UserProfileDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role,
                SubscriptionStatus = user.SubscriptionStatus,
                CreatedAt = user.CreatedAt,
                TotalCourses = totalCourses,
                ActiveCourses = activeCourses
            };

            return Ok(profile);
        }
    }
}
