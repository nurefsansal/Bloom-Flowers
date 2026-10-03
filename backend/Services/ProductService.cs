using backend.DTOs;
using backend.Entities;
using backend.Repositories.Interfaces;
using backend.Services.Interfaces;

namespace backend.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;
        private readonly IFileStorageService _fileStorageService;

        public ProductService(
            IProductRepository productRepository,
            IFileStorageService fileStorageService)
        {
            _productRepository = productRepository;
            _fileStorageService = fileStorageService;
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

            if (dto.Image == null)
            {
                throw new InvalidOperationException(
                    "Ürün görseli seçilmelidir.");
            }

            var imageUrl =
                await _fileStorageService.SaveProductImageAsync(
                    dto.Image);

            var product = new Product
            {
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                StockQuantity = dto.StockQuantity,
                ImageUrl = imageUrl,
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

            var existingProduct =
                await _productRepository.GetByIdAsync(id);

            if (existingProduct == null)
            {
                return null;
            }

            var imageUrl = existingProduct.ImageUrl;

            if (dto.Image != null)
            {
                imageUrl =
                    await _fileStorageService.SaveProductImageAsync(
                        dto.Image);

                await _fileStorageService.DeleteProductImageAsync(
                    existingProduct.ImageUrl);
            }

            var product = new Product
            {
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                StockQuantity = dto.StockQuantity,
                ImageUrl = imageUrl,
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