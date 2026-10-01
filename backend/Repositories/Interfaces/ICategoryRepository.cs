using backend.Entities;

namespace backend.Repositories.Interfaces
{
    public interface ICategoryRepository
    {
        Task<List<Category>> GetAllAsync();

        Task<Category> CreateAsync(Category category);

        Task<Category?> UpdateAsync(
            int id,
            Category updatedCategory);

        Task<bool> DeleteAsync(int id);

        Task<bool> HasProductsAsync(int id);
    }
}