using Microsoft.AspNetCore.Http;

namespace backend.DTOs
{
    public class CreateProductDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
        public IFormFile? Image { get; set; }
        public int CategoryId { get; set; }
    }
}