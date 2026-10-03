using backend.Entities;

namespace backend.Repositories.Interfaces
{
    public interface IOrderRepository
    {
        Task<List<Order>> GetByUserIdAsync(int userId);

        Task<Order?> GetByIdAsync(int id);

        Task<Order?> GetByIdWithUserAsync(int id);

        Task<int> GetOrderCountAsync();

        Task<Order> CreateAsync(Order order);

        Task<List<Order>> GetAllAsync();

        Task<Order?> UpdateStatusAsync(
            int id,
            OrderStatus status);

        // Dashboard analizleri
        Task<List<(int Year, int Month, decimal Revenue)>> GetMonthlySalesAsync();

        Task<List<(OrderStatus Status, int Count)>> GetOrderStatusCountsAsync();

        Task<List<(int ProductId, string ProductName, int TotalQuantity, decimal TotalRevenue)>>
            GetTopProductsAsync(int take);
    }
}