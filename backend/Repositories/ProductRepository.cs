using backend.Data;
using backend.Entities;
using backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly BloomFlowersDbContext _context;

        public ProductRepository(BloomFlowersDbContext context)
        {
            _context = context;
        }

        public async Task<List<Product>> GetAllAsync()
        {
            return await _context.Products
                .Where(p => p.IsActive)
                .Include(p => p.Category)
                .ToListAsync();
        }

        public async Task<Product?> GetByIdAsync(int id)
        {
            return await _context.Products
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Product> CreateAsync(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return product;
        }

        public async Task<Product?> UpdateAsync(
            int id,
            Product updatedProduct)
        {
            var existing =
                await _context.Products.FindAsync(id);

            if (existing == null)
            {
                return null;
            }

            existing.Name = updatedProduct.Name;
            existing.Description = updatedProduct.Description;
            existing.Price = updatedProduct.Price;
            existing.StockQuantity = updatedProduct.StockQuantity;
            existing.ImageUrl = updatedProduct.ImageUrl;
            existing.CategoryId = updatedProduct.CategoryId;

            await _context.SaveChangesAsync();

            return existing;
        }

        public async Task<bool> SoftDeleteAsync(int id)
        {
            var product =
                await _context.Products.FindAsync(id);

            if (product == null)
            {
                return false;
            }

            product.IsActive = false;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> CategoryExistsAsync(
            int categoryId)
        {
            return await _context.Categories
                .AnyAsync(c => c.Id == categoryId);
        }
    }
}