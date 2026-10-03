using backend.Services.Interfaces;

namespace backend.Services
{
    public class FileStorageService : IFileStorageService
    {
        private readonly IWebHostEnvironment _environment;

        private static readonly string[] AllowedExtensions =
        {
            ".jpg",
            ".jpeg",
            ".png",
            ".webp"
        };

        private const long MaxFileSize = 5 * 1024 * 1024;

        public FileStorageService(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        public async Task<string> SaveProductImageAsync(IFormFile image)
        {
            if (image == null || image.Length == 0)
            {
                throw new InvalidOperationException(
                    "Bir ürün görseli seçilmelidir.");
            }

            if (image.Length > MaxFileSize)
            {
                throw new InvalidOperationException(
                    "Ürün görseli 5 MB'dan büyük olamaz.");
            }

            var extension =
                Path.GetExtension(image.FileName).ToLowerInvariant();

            if (!AllowedExtensions.Contains(extension))
            {
                throw new InvalidOperationException(
                    "Sadece JPG, JPEG, PNG ve WEBP görseller yüklenebilir.");
            }

            var uploadsFolder = Path.Combine(
                _environment.ContentRootPath,
                "wwwroot",
                "uploads",
                "products"
            );

            Directory.CreateDirectory(uploadsFolder);

            var fileName =
                $"{Guid.NewGuid()}{extension}";

            var filePath = Path.Combine(
                uploadsFolder,
                fileName
            );

            await using var stream =
                new FileStream(
                    filePath,
                    FileMode.Create
                );

            await image.CopyToAsync(stream);

            return $"/uploads/products/{fileName}";
        }

        public Task DeleteProductImageAsync(string? imageUrl)
        {
            if (string.IsNullOrWhiteSpace(imageUrl))
            {
                return Task.CompletedTask;
            }

            if (!imageUrl.StartsWith(
                "/uploads/products/",
                StringComparison.OrdinalIgnoreCase))
            {
                return Task.CompletedTask;
            }

            var fileName =
                Path.GetFileName(imageUrl);

            if (string.IsNullOrWhiteSpace(fileName))
            {
                return Task.CompletedTask;
            }

            var filePath = Path.Combine(
                _environment.ContentRootPath,
                "wwwroot",
                "uploads",
                "products",
                fileName
            );

            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }

            return Task.CompletedTask;
        }
    }
}