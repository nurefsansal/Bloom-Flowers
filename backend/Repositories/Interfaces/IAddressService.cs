using backend.DTOs;

namespace backend.Services.Interfaces
{
    public interface IAddressService
    {
        Task<List<AddressDto>> GetUserAddressesAsync(int userId);
        Task<AddressDto> CreateAddressAsync(int userId, CreateAddressDto dto);
    }
}