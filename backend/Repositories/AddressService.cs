using backend.DTOs;
using backend.Entities;
using backend.Repositories.Interfaces;
using backend.Services.Interfaces;

namespace backend.Services
{
    public class AddressService : IAddressService
    {
        private readonly IAddressRepository _addressRepository;

        public AddressService(IAddressRepository addressRepository)
        {
            _addressRepository = addressRepository;
        }

        public async Task<List<AddressDto>> GetUserAddressesAsync(int userId)
        {
            var addresses = await _addressRepository.GetByUserIdAsync(userId);

            return addresses.Select(a => new AddressDto
            {
                Id = a.Id,
                Title = a.Title,
                City = a.City,
                District = a.District,
                FullAddress = a.FullAddress,
                PhoneNumber = a.PhoneNumber
            }).ToList();
        }

        public async Task<AddressDto> CreateAddressAsync(int userId, CreateAddressDto dto)
        {
            var newAddress = new Address
            {
                UserId = userId,
                Title = dto.Title,
                City = dto.City,
                District = dto.District,
                FullAddress = dto.FullAddress,
                PhoneNumber = dto.PhoneNumber
            };

            var created = await _addressRepository.CreateAsync(newAddress);

            return new AddressDto
            {
                Id = created.Id,
                Title = created.Title,
                City = created.City,
                District = created.District,
                FullAddress = created.FullAddress,
                PhoneNumber = created.PhoneNumber
            };
        }
    }
}