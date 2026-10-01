using backend.DTOs;
using backend.Entities;
using backend.Repositories.Interfaces;
using backend.Services.Interfaces;

namespace backend.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoryService(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<List<Category>> GetAllCategoriesAsync()
        {
            return await _categoryRepository.GetAllAsync();
        }

        public async Task<CategoryDto> CreateCategoryAsync(
            CreateCategoryDto dto)
        {
            var category = new Category
            {
                Name = dto.Name,
                Description = dto.Description
            };

            var created =
                await _categoryRepository.CreateAsync(category);

            return new CategoryDto
            {
                Id = created.Id,
                Name = created.Name,
                Description = created.Description
            };
        }

        public async Task<CategoryDto?> UpdateCategoryAsync(
            int id,
            CreateCategoryDto dto)
        {
            var category = new Category
            {
                Name = dto.Name,
                Description = dto.Description
            };

            var updated =
                await _categoryRepository.UpdateAsync(id, category);

            if (updated == null)
            {
                return null;
            }

            return new CategoryDto
            {
                Id = updated.Id,
                Name = updated.Name,
                Description = updated.Description
            };
        }

        public async Task<bool> DeleteCategoryAsync(int id)
        {
            var hasProducts =
                await _categoryRepository.HasProductsAsync(id);

            if (hasProducts)
            {
                throw new InvalidOperationException(
                    "Bu kategoriye ait ürünler var. Önce ürünleri başka bir kategoriye taşıyın.");
            }

            return await _categoryRepository.DeleteAsync(id);
        }
    }
}