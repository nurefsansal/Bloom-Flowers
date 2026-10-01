using backend.Entities;

namespace backend.Repositories.Interfaces
{
    public interface IProductRepository
    {
        Task<List<Product>> GetAllAsync();
        Task<Product?> GetByIdAsync(int id);
        Task<Product> CreateAsync(Product product);
        Task<Product?> UpdateAsync(int id, Product updatedProduct);
        Task<bool> SoftDeleteAsync(int id);
        Task<bool> CategoryExistsAsync(int categoryId);
    }
}