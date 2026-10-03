using backend.Data;
using backend.DTOs;
using backend.Entities;
using backend.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class DashboardController : ControllerBase
    {
        private readonly BloomFlowersDbContext _context;
        private readonly IOrderRepository _orderRepository;

        public DashboardController(
            BloomFlowersDbContext context,
            IOrderRepository orderRepository)
        {
            _context = context;
            _orderRepository = orderRepository;
        }

        [HttpGet("summary")]
        public async Task<ActionResult<DashboardSummaryDto>> GetSummary()
        {
            var summary = new DashboardSummaryDto
            {
                TotalOrders = await _context.Orders.CountAsync(),
                PendingOrders = await _context.Orders.CountAsync(
                    o => o.Status == OrderStatus.Pending),

                TotalProducts = await _context.Products.CountAsync(
                    p => p.IsActive),

                TotalCustomers = await _context.Users.CountAsync(
                    u => u.RoleId == 1),

                TotalRevenue = await _context.Orders
                    .Where(o => o.Status != OrderStatus.Cancelled)
                    .SumAsync(o => o.TotalPrice)
            };

            return Ok(summary);
        }

        [HttpGet("analytics")]
        public async Task<ActionResult<DashboardAnalyticsDto>> GetAnalytics()
        {
            var monthlySalesRaw =
                await _orderRepository.GetMonthlySalesAsync();

            var statusCountsRaw =
                await _orderRepository.GetOrderStatusCountsAsync();

            var topProductsRaw =
                await _orderRepository.GetTopProductsAsync(5);

            var turkishMonths = new[]
            {
                "",
                "Oca",
                "Şub",
                "Mar",
                "Nis",
                "May",
                "Haz",
                "Tem",
                "Ağu",
                "Eyl",
                "Eki",
                "Kas",
                "Ara"
            };

            var monthlySales = monthlySalesRaw
                .Select(x => new MonthlySalesDto
                {
                    Month = $"{x.Year}-{x.Month:D2}",
                    Label = $"{turkishMonths[x.Month]} {x.Year}",
                    Revenue = x.Revenue
                })
                .ToList();

            var statusCountsByStatus = statusCountsRaw
                .ToDictionary(x => x.Status, x => x.Count);

            var statusBreakdown = Enum
                .GetValues<OrderStatus>()
                .Select(status => new OrderStatusCountDto
                {
                    Status = status.ToString(),
                    Count = statusCountsByStatus.TryGetValue(
                        status,
                        out var count)
                        ? count
                        : 0
                })
                .ToList();

            var topProducts = topProductsRaw
                .Select(x => new TopProductDto
                {
                    ProductId = x.ProductId,
                    ProductName = x.ProductName,
                    TotalQuantitySold = x.TotalQuantity,
                    TotalRevenue = x.TotalRevenue
                })
                .ToList();

            return Ok(new DashboardAnalyticsDto
            {
                MonthlySales = monthlySales,
                OrderStatusBreakdown = statusBreakdown,
                TopProducts = topProducts
            });
        }
    }
}

