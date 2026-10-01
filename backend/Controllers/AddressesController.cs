using System.Security.Claims;
using backend.DTOs;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AddressesController : ControllerBase
    {
        private readonly IAddressService _addressService;

        public AddressesController(IAddressService addressService)
        {
            _addressService = addressService;
        }

        private int GetCurrentUserId()
        {
            var idClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return int.Parse(idClaim!);
        }

        [HttpGet]
        public async Task<ActionResult<List<AddressDto>>> GetMyAddresses()
        {
            var userId = GetCurrentUserId();
            var addresses = await _addressService.GetUserAddressesAsync(userId);
            return Ok(addresses);
        }

        [HttpPost]
        public async Task<ActionResult<AddressDto>> Create(CreateAddressDto dto)
        {
            var userId = GetCurrentUserId();
            var created = await _addressService.CreateAddressAsync(userId, dto);
            return Ok(created);
        }
    }
}