using backend.DTOs;
using backend.Entities;
using backend.Repositories.Interfaces;
using backend.Services.Interfaces;

namespace backend.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;

        public ProductService(
            IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<List<Product>> GetAllProductsAsync()
        {
            return await _productRepository.GetAllAsync();
        }

        public async Task<Product?> GetProductByIdAsync(int id)
        {
            return await _productRepository.GetByIdAsync(id);
        }

        public async Task<ProductDto> CreateProductAsync(
            CreateProductDto dto)
        {
            var categoryExists =
                await _productRepository.CategoryExistsAsync(
                    dto.CategoryId);

            if (!categoryExists)
            {
                throw new InvalidOperationException(
                    "Geçersiz kategori.");
            }

            var product = new Product
            {
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                StockQuantity = dto.StockQuantity,
                ImageUrl = dto.ImageUrl,
                CategoryId = dto.CategoryId,
                IsActive = true
            };

            var created =
                await _productRepository.CreateAsync(product);

            var withCategory =
                await _productRepository.GetByIdAsync(
                    created.Id);

            return new ProductDto
            {
                Id = withCategory!.Id,
                Name = withCategory.Name,
                Description = withCategory.Description,
                Price = withCategory.Price,
                StockQuantity = withCategory.StockQuantity,
                ImageUrl = withCategory.ImageUrl,
                CategoryName = withCategory.Category.Name
            };
        }

        public async Task<ProductDto?> UpdateProductAsync(
            int id,
            UpdateProductDto dto)
        {
            var categoryExists =
                await _productRepository.CategoryExistsAsync(
                    dto.CategoryId);

            if (!categoryExists)
            {
                throw new InvalidOperationException(
                    "Geçersiz kategori.");
            }

            var product = new Product
            {
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                StockQuantity = dto.StockQuantity,
                ImageUrl = dto.ImageUrl,
                CategoryId = dto.CategoryId
            };

            var updated =
                await _productRepository.UpdateAsync(
                    id,
                    product);

            if (updated == null)
            {
                return null;
            }

            var withCategory =
                await _productRepository.GetByIdAsync(
                    updated.Id);

            return new ProductDto
            {
                Id = withCategory!.Id,
                Name = withCategory.Name,
                Description = withCategory.Description,
                Price = withCategory.Price,
                StockQuantity = withCategory.StockQuantity,
                ImageUrl = withCategory.ImageUrl,
                CategoryName = withCategory.Category.Name
            };
        }

        public async Task<bool> DeleteProductAsync(int id)
        {
            return await _productRepository.SoftDeleteAsync(id);
        }
    }
}