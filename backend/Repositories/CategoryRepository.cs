using backend.Data;
using backend.Entities;
using backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly BloomFlowersDbContext _context;

        public CategoryRepository(BloomFlowersDbContext context)
        {
            _context = context;
        }

        public async Task<List<Category>> GetAllAsync()
        {
            return await _context.Categories.ToListAsync();
        }

        public async Task<Category> CreateAsync(Category category)
        {
            _context.Categories.Add(category);

            await _context.SaveChangesAsync();

            return category;
        }

        public async Task<Category?> UpdateAsync(
            int id,
            Category updatedCategory)
        {
            var existing = await _context.Categories.FindAsync(id);

            if (existing == null)
            {
                return null;
            }

            existing.Name = updatedCategory.Name;
            existing.Description = updatedCategory.Description;

            await _context.SaveChangesAsync();

            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var category = await _context.Categories.FindAsync(id);

            if (category == null)
            {
                return false;
            }

            _context.Categories.Remove(category);

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> HasProductsAsync(int id)
        {
            return await _context.Products
                .AnyAsync(p => p.CategoryId == id);
        }
    }
}