using backend.Data;
using backend.Entities;
using backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly BloomFlowersDbContext _context;

        public OrderRepository(BloomFlowersDbContext context)
        {
            _context = context;
        }

        public async Task<List<Order>> GetByUserIdAsync(int userId)
        {
            return await _context.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }

        public async Task<Order?> GetByIdAsync(int id)
        {
            return await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .FirstOrDefaultAsync(o => o.Id == id);
        }

        public async Task<Order?> GetByIdWithUserAsync(int id)
        {
            return await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .Include(o => o.User)
                .FirstOrDefaultAsync(o => o.Id == id);
        }

        public async Task<int> GetOrderCountAsync()
        {
            return await _context.Orders.CountAsync();
        }

        public async Task<Order> CreateAsync(Order order)
        {
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return order;
        }

        public async Task<List<Order>> GetAllAsync()
        {
            return await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }

        public async Task<Order?> UpdateStatusAsync(
            int id,
            OrderStatus status)
        {
            var order = await _context.Orders
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return null;
            }

            order.Status = status;

            await _context.SaveChangesAsync();

            return await GetByIdAsync(id);
        }

        // Dashboard: Aylık satış analizi
        public async Task<List<(int Year, int Month, decimal Revenue)>> GetMonthlySalesAsync()
        {
            var result = await _context.Orders
                .AsNoTracking()
                .Where(o => o.Status != OrderStatus.Cancelled)
                .GroupBy(o => new
                {
                    o.CreatedAt.Year,
                    o.CreatedAt.Month
                })
                .Select(g => new
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    Revenue = g.Sum(o => o.TotalPrice)
                })
                .OrderBy(x => x.Year)
                .ThenBy(x => x.Month)
                .ToListAsync();

            return result
                .Select(x => (x.Year, x.Month, x.Revenue))
                .ToList();
        }

        // Dashboard: Sipariş durumlarının dağılımı
        public async Task<List<(OrderStatus Status, int Count)>> GetOrderStatusCountsAsync()
        {
            var result = await _context.Orders
                .AsNoTracking()
                .GroupBy(o => o.Status)
                .Select(g => new
                {
                    Status = g.Key,
                    Count = g.Count()
                })
                .ToListAsync();

            return result
                .Select(x => (x.Status, x.Count))
                .ToList();
        }

        // Dashboard: En çok satan ürünler
        public async Task<List<(int ProductId, string ProductName, int TotalQuantity, decimal TotalRevenue)>>
            GetTopProductsAsync(int take)
        {
            var result = await _context.OrderItems
                .AsNoTracking()
                .Where(oi => oi.Order.Status != OrderStatus.Cancelled)
                .GroupBy(oi => new
                {
                    oi.ProductId,
                    oi.Product.Name
                })
                .Select(g => new
                {
                    ProductId = g.Key.ProductId,
                    ProductName = g.Key.Name,
                    TotalQuantity = g.Sum(oi => oi.Quantity),
                    TotalRevenue = g.Sum(oi => oi.Quantity * oi.UnitPrice)
                })
                .OrderByDescending(x => x.TotalQuantity)
                .ThenByDescending(x => x.TotalRevenue)
                .Take(take)
                .ToListAsync();

            return result
                .Select(x => (
                    x.ProductId,
                    x.ProductName,
                    x.TotalQuantity,
                    x.TotalRevenue
                ))
                .ToList();
        }
    }
}