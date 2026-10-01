using backend.DTOs;
using backend.Entities;

namespace backend.Services.Interfaces
{
    public interface IProductService
    {
        Task<List<Product>> GetAllProductsAsync();

        Task<Product?> GetProductByIdAsync(int id);

        Task<ProductDto> CreateProductAsync(CreateProductDto dto);

        Task<ProductDto?> UpdateProductAsync(
            int id,
            UpdateProductDto dto);

        Task<bool> DeleteProductAsync(int id);
    }
}