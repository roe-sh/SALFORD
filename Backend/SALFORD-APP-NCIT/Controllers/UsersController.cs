using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SALFORD_APP_NCIT.DTOs;
using SALFORD_APP_NCIT.Models;

namespace SALFORD_APP_NCIT.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly SalfordContext _context;
        private readonly IConfiguration _configuration;

        public UsersController(SalfordContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // ===========================================
        // CRUD SECTION
        // ===========================================

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound(new { message = "User not found" });

            return user;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            if (id != user.Id)
                return BadRequest(new { message = "Mismatched user ID" });

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                    return NotFound(new { message = "User not found" });
                else
                    throw;
            }

            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound(new { message = "User not found" });

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool UserExists(int id) => _context.Users.Any(e => e.Id == id);

        // ===========================================
        // AUTHENTICATION SECTION
        // ===========================================

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequestDto request)
        {
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                return BadRequest(new { message = "Email already exists" });

            CreatePasswordHash(request.Password, out byte[] hash, out byte[] salt);

            var user = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                PasswordHash = $"{Convert.ToBase64String(hash)}:{Convert.ToBase64String(salt)}",
                Role = "Student",
                SubscriptionStatus = "None",
                CreatedAt = DateTime.Now
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User registered successfully" });
        }
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // In JWT, logout is handled client-side by deleting the token.
            // Here we just return a success message.
            return Ok(new { message = "User logged out successfully. Please clear the token on the client side." });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequestDto request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
                return Unauthorized(new { message = "Invalid email or password" });

            var parts = user.PasswordHash.Split(':');
            if (parts.Length != 2)
                return Unauthorized(new { message = "Invalid stored password format" });

            var storedHash = Convert.FromBase64String(parts[0]);
            var storedSalt = Convert.FromBase64String(parts[1]);

            if (!VerifyPasswordHash(request.Password, storedHash, storedSalt))
                return Unauthorized(new { message = "Invalid email or password" });

            string token;
            try
            {
                token = CreateJwtToken(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Token generation failed", error = ex.Message });
            }

            var response = new UserResponseDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role,
                Token = token
            };

            return Ok(response);
        }

        [HttpPost("external-login")]
        public IActionResult ExternalLogin(ExternalLoginRequestDto model)
        {
            return Ok(new { message = "External authentication endpoint ready" });
        }

        // ===========================================
        // HELPER METHODS
        // ===========================================

        private void CreatePasswordHash(string password, out byte[] hash, out byte[] salt)
        {
            using var hmac = new HMACSHA512();
            salt = hmac.Key;
            hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        }

        private bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
        {
            using var hmac = new HMACSHA512(storedSalt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            return computedHash.SequenceEqual(storedHash);
        }

        private string CreateJwtToken(User user)
        {
            var jwtKey = _configuration["Jwt:Key"];
            if (string.IsNullOrEmpty(jwtKey))
                throw new Exception("JWT Key is not configured in appsettings.json");

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var issuer = _configuration["Jwt:Issuer"];
            var audience = _configuration["Jwt:Audience"];
            var expireMinutes = _configuration.GetValue<int>("Jwt:ExpireMinutes", 60);

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.Now.AddMinutes(expireMinutes),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
