using backend.DTOs;
using backend.Entities;

namespace backend.Services.Interfaces
{
    public interface ICategoryService
    {
        Task<List<Category>> GetAllCategoriesAsync();

        Task<CategoryDto> CreateCategoryAsync(
            CreateCategoryDto dto);

        Task<CategoryDto?> UpdateCategoryAsync(
            int id,
            CreateCategoryDto dto);

        Task<bool> DeleteCategoryAsync(int id);
    }
}