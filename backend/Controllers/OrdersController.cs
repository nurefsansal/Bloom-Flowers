using System.Security.Claims;
using backend.DTOs;
using backend.Entities;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        private int GetCurrentUserId()
        {
            var idClaim =
                User.FindFirstValue(
                    ClaimTypes.NameIdentifier);

            return int.Parse(idClaim!);
        }

        // CUSTOMER
 
        [HttpPost]
        public async Task<ActionResult<OrderDto>> Create(
            CreateOrderDto dto)
        {
            try
            {
                var userId = GetCurrentUserId();

                var order =
                    await _orderService.CreateOrderAsync(
                        userId,
                        dto);

                return Ok(order);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }

        [HttpGet]
        public async Task<ActionResult<List<OrderDto>>>
            GetMyOrders()
        {
            var userId = GetCurrentUserId();

            var orders =
                await _orderService.GetUserOrdersAsync(
                    userId);

            return Ok(orders);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDto>> GetById(
            int id)
        {
            var userId = GetCurrentUserId();

            var order =
                await _orderService.GetOrderByIdAsync(
                    userId,
                    id);

            if (order == null)
            {
                return NotFound();
            }

            return Ok(order);
        }

        // ADMIN

        [HttpGet("admin")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<OrderDto>>>
            GetAllOrders()
        {
            var orders =
                await _orderService.GetAllOrdersAsync();

            return Ok(orders);
        }

        [HttpPut("admin/{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<OrderDto>>
            UpdateStatus(
                int id,
                [FromBody] UpdateOrderStatusDto dto)
        {
            try
            {
                if (!Enum.TryParse<OrderStatus>(
                        dto.Status,
                        true,
                        out var status))
                {
                    return BadRequest(new
                    {
                        message =
                            "Geçersiz sipariş durumu."
                    });
                }

                var updated =
                    await _orderService.UpdateOrderStatusAsync(
                        id,
                        status);

                if (updated == null)
                {
                    return NotFound();
                }

                return Ok(updated);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }
    }
}