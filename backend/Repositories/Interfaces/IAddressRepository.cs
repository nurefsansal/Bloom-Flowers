using backend.Entities;

namespace backend.Repositories.Interfaces
{
    public interface IAddressRepository
    {
        Task<List<Address>> GetByUserIdAsync(int userId);
        Task<Address> CreateAsync(Address address);
    }
}