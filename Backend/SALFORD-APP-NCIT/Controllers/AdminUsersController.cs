using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SALFORD_APP_NCIT.DTOs;
using SALFORD_APP_NCIT.Models;
using System.Security.Cryptography;
using System.Text;

namespace SALFORD_APP_NCIT.Controllers
{
    [Route("api/admin/users")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminUsersController : ControllerBase
    {
        private readonly SalfordContext _context;

        public AdminUsersController(SalfordContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserResponseDto>>> GetAllUsers()
        {
            var users = await _context.Users
                .Select(u => new UserResponseDto
                {
                    Id = u.Id,
                    FullName = u.FullName,
                    Email = u.Email,
                    Role = u.Role
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserResponseDto>> GetUserById(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            return Ok(new UserResponseDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role
            });
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateAdmin(RegisterRequestDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                return BadRequest("Email already exists");

            CreatePasswordHash(dto.Password, out byte[] hash, out byte[] salt);

            var admin = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PasswordHash = $"{Convert.ToBase64String(hash)}:{Convert.ToBase64String(salt)}",
                Role = "Admin",
                SubscriptionStatus = "Active",
                CreatedAt = DateTime.Now
            };

            _context.Users.Add(admin);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Admin created successfully" });
        }

        [HttpPut("update-role/{id}")]
        public async Task<IActionResult> UpdateRole(int id, [FromBody] string newRole)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound("User not found");

            if (newRole != "Admin" && newRole != "Student")
                return BadRequest("Invalid role");

            user.Role = newRole;
            await _context.SaveChangesAsync();

            return Ok(new { message = $"User role updated to {newRole}" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User deleted successfully" });
        }

        private void CreatePasswordHash(string password, out byte[] hash, out byte[] salt)
        {
            using var hmac = new HMACSHA512();
            salt = hmac.Key;
            hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        }
    }
}
