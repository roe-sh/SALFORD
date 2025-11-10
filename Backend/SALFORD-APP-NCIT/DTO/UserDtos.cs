namespace SALFORD_APP_NCIT.DTOs
{
    // DTO for registration request
    public class RegisterRequestDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    // DTO for login request
    public class LoginRequestDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class ExternalLoginRequestDto
    {
        public string Provider { get; set; } = string.Empty; 
        public string AccessToken { get; set; } = string.Empty;
    }

    public class UserResponseDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
    }
}
