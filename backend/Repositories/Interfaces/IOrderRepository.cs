using backend.Entities;

namespace backend.Repositories.Interfaces
{
    public interface IOrderRepository
    {
        Task<List<Order>> GetByUserIdAsync(int userId);

        Task<Order?> GetByIdAsync(int id);

        Task<int> GetOrderCountAsync();

        Task<Order> CreateAsync(Order order);

        Task<List<Order>> GetAllAsync();

        Task<Order?> UpdateStatusAsync(
            int id,
            OrderStatus status);
    }
}