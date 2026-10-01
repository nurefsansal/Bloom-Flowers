using backend.Data;
using backend.DTOs;
using backend.Entities;
using backend.Repositories.Interfaces;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly BloomFlowersDbContext _context;

        public OrderService(
            IOrderRepository orderRepository,
            BloomFlowersDbContext context)
        {
            _orderRepository = orderRepository;
            _context = context;
        }

        public async Task<OrderDto> CreateOrderAsync(
            int userId,
            CreateOrderDto dto)
        {
            var address = await _context.Addresses
                .FirstOrDefaultAsync(
                    a => a.Id == dto.AddressId &&
                         a.UserId == userId);

            if (address == null)
            {
                throw new InvalidOperationException(
                    "Geçersiz adres.");
            }

            using var transaction =
                await _context.Database.BeginTransactionAsync();

            try
            {
                var orderItems = new List<OrderItem>();
                decimal totalPrice = 0;

                foreach (var item in dto.Items)
                {
                    var product =
                        await _context.Products.FindAsync(
                            item.ProductId);

                    if (product == null)
                    {
                        throw new InvalidOperationException(
                            $"Ürün bulunamadı (ID: {item.ProductId}).");
                    }

                    if (product.StockQuantity < item.Quantity)
                    {
                        throw new InvalidOperationException(
                            $"'{product.Name}' için yeterli stok yok. " +
                            $"Mevcut stok: {product.StockQuantity}");
                    }

                    product.StockQuantity -= item.Quantity;

                    orderItems.Add(new OrderItem
                    {
                        ProductId = product.Id,
                        Quantity = item.Quantity,
                        UnitPrice = product.Price
                    });

                    totalPrice +=
                        product.Price * item.Quantity;
                }

                var orderCount =
                    await _orderRepository.GetOrderCountAsync();

                var orderNumber =
                    $"BF-{DateTime.UtcNow.Year}-{(orderCount + 1):D6}";

                var newOrder = new Order
                {
                    UserId = userId,
                    AddressId = address.Id,
                    DeliveryCity = address.City,
                    DeliveryDistrict = address.District,
                    DeliveryFullAddress = address.FullAddress,
                    DeliveryPhoneNumber = address.PhoneNumber,
                    OrderNumber = orderNumber,
                    Status = OrderStatus.Pending,
                    DeliveryDate = dto.DeliveryDate,
                    DeliveryTimeSlot = dto.DeliveryTimeSlot,
                    OrderNote = dto.OrderNote,
                    TotalPrice = totalPrice,
                    OrderItems = orderItems
                };

                _context.Orders.Add(newOrder);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return await MapToDtoAsync(newOrder);
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<List<OrderDto>> GetUserOrdersAsync(
            int userId)
        {
            var orders =
                await _orderRepository.GetByUserIdAsync(userId);

            return orders
                .Select(MapToDto)
                .ToList();
        }

        public async Task<OrderDto?> GetOrderByIdAsync(
            int userId,
            int orderId)
        {
            var order =
                await _orderRepository.GetByIdAsync(orderId);

            if (order == null ||
                order.UserId != userId)
            {
                return null;
            }

            return MapToDto(order);
        }

        public async Task<List<OrderDto>> GetAllOrdersAsync()
        {
            var orders =
                await _orderRepository.GetAllAsync();

            return orders
                .Select(MapToDto)
                .ToList();
        }

        public async Task<OrderDto?> UpdateOrderStatusAsync(
            int orderId,
            OrderStatus status)
        {
            var order =
                await _orderRepository.GetByIdAsync(orderId);

            if (order == null)
            {
                return null;
            }

            // Teslim edilmiş bir sipariş iptal edilemez.
            if (order.Status == OrderStatus.Delivered &&
                status == OrderStatus.Cancelled)
            {
                throw new InvalidOperationException(
                    "Teslim edilmiş bir sipariş iptal edilemez.");
            }

            var updated =
                await _orderRepository.UpdateStatusAsync(
                    orderId,
                    status);

            if (updated == null)
            {
                return null;
            }

            return MapToDto(updated);
        }

        private async Task<OrderDto> MapToDtoAsync(
            Order order)
        {
            // Yeni oluşturulan siparişte Product navigation
            // henüz dolu olmayabilir.
            var fullOrder =
                await _orderRepository.GetByIdAsync(
                    order.Id);

            return MapToDto(fullOrder!);
        }

        private OrderDto MapToDto(Order order)
        {
            return new OrderDto
            {
                Id = order.Id,
                OrderNumber = order.OrderNumber,
                Status = order.Status.ToString(),
                DeliveryDate = order.DeliveryDate,
                DeliveryTimeSlot = order.DeliveryTimeSlot,
                OrderNote = order.OrderNote,
                DeliveryCity = order.DeliveryCity,
                DeliveryDistrict = order.DeliveryDistrict,
                DeliveryFullAddress = order.DeliveryFullAddress,
                TotalPrice = order.TotalPrice,
                CreatedAt = order.CreatedAt,

                Items = order.OrderItems
                    .Select(oi => new OrderItemDto
                    {
                        ProductId = oi.ProductId,
                        ProductName = oi.Product.Name,
                        Quantity = oi.Quantity,
                        UnitPrice = oi.UnitPrice
                    })
                    .ToList()
            };
        }
    }
}