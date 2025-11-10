using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SALFORD_APP_NCIT.DTOs;
using SALFORD_APP_NCIT.Models;

namespace SALFORD_APP_NCIT.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly SalfordContext _context;

        public CategoriesController(SalfordContext context)
        {
            _context = context;
        }

        // ===========================================================
        // GET: api/Categories
        // Public endpoint (students & admins)
        // ===========================================================
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryResponseDto>>> GetCategories()
        {
            var categories = await _context.Categories
                .Select(c => new CategoryResponseDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description,
                    CreatedAt = c.CreatedAt ?? DateTime.MinValue // Fixes CS0266 and CS8629
                })
                .ToListAsync();

            return Ok(categories);
        }

        // ===========================================================
        // GET: api/Categories/5
        // ===========================================================
        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryResponseDto>> GetCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
                return NotFound();

            var dto = new CategoryResponseDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                CreatedAt = category.CreatedAt ?? DateTime.MinValue // Fixes CS0266 and CS8629
            };

            return Ok(dto);
        }

        // ===========================================================
        // POST: api/Categories
        // Admin only: create new category
        // ===========================================================
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<CategoryResponseDto>> PostCategory(CategoryRequestDto request)
        {
            var category = new Category
            {
                Name = request.Name,
                Description = request.Description,
                CreatedAt = DateTime.Now
            };

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            var response = new CategoryResponseDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                CreatedAt = category.CreatedAt ?? DateTime.MinValue // Fixes CS0266 and CS8629
            };

            return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, response);
        }

        // ===========================================================
        // PUT: api/Categories/5
        // Admin only: update existing category
        // ===========================================================
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategory(int id, CategoryRequestDto request)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
                return NotFound();

            category.Name = request.Name;
            category.Description = request.Description;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Category updated successfully" });
        }

        // ===========================================================
        // DELETE: api/Categories/5
        // Admin only: delete category
        // ===========================================================
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
                return NotFound();

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Category deleted successfully" });
        }

        private bool CategoryExists(int id)
        {
            return _context.Categories.Any(e => e.Id == id);
        }
    }
}
