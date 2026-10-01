using backend.DTOs;
using backend.Entities;
using backend.Repositories.Interfaces;
using backend.Services.Interfaces;

namespace backend.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly TokenService _tokenService;

        public AuthService(
            IUserRepository userRepository,
            TokenService tokenService)
        {
            _userRepository = userRepository;
            _tokenService = tokenService;
        }

        public async Task<AuthResponseDto?> RegisterAsync(RegisterDto dto)
        {
            var existingUser = await _userRepository.GetByEmailAsync(dto.Email);

            if (existingUser != null)
            {
                return null;
            }

            var newUser = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                PhoneNumber = dto.PhoneNumber,
                RoleId = 1 // Customer
            };

            var createdUser = await _userRepository.CreateAsync(newUser);

            // Kullanıcıyı Role bilgisiyle birlikte tekrar çekiyoruz.
            var userWithRole =
                await _userRepository.GetByEmailAsync(createdUser.Email);

            if (userWithRole == null || userWithRole.Role == null)
            {
                return null;
            }

            var token = _tokenService.GenerateToken(userWithRole);

            return new AuthResponseDto
            {
                Token = token,
                UserId = userWithRole.Id,
                FullName = userWithRole.FullName,
                Email = userWithRole.Email,
                Role = userWithRole.Role.Name
            };
        }

        public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
        {
            var user = await _userRepository.GetByEmailAsync(dto.Email);

            if (user == null ||
                !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                return null;
            }

            // Geçici kontrol:
            // Login sırasında kullanıcının rolünü terminalde göreceğiz.
            Console.WriteLine($"LOGIN USER: {user.Email}");
            Console.WriteLine($"LOGIN ROLE: {user.Role?.Name}");

            if (user.Role == null)
            {
                Console.WriteLine("LOGIN ROLE ERROR: Kullanıcının Role bilgisi null.");
                return null;
            }

            var token = _tokenService.GenerateToken(user);

            return new AuthResponseDto
            {
                Token = token,
                UserId = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role.Name
            };
        }
    }
}