namespace backend.Services.Interfaces
{
    public interface IFileStorageService
    {
        Task<string> SaveProductImageAsync(IFormFile image);

        Task DeleteProductImageAsync(string? imageUrl);
    }
}