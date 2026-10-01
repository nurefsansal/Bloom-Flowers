using backend.DTOs;
using backend.Entities;

namespace backend.Services.Interfaces
{
    public interface IOrderService
    {
        Task<OrderDto> CreateOrderAsync(
            int userId,
            CreateOrderDto dto);

        Task<List<OrderDto>> GetUserOrdersAsync(
            int userId);

        Task<OrderDto?> GetOrderByIdAsync(
            int userId,
            int orderId);

        Task<List<OrderDto>> GetAllOrdersAsync();

        Task<OrderDto?> UpdateOrderStatusAsync(
            int orderId,
            OrderStatus status);
    }
}