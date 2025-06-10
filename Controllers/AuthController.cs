using Greenhouse_farming.Models.DTO;
using Greenhouse_farming.Models.Entity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;


[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;
    private readonly PasswordHasher<User> _passwordHasher = new PasswordHasher<User>();

    public AuthController(AppDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    private object GenerateJwtTokenResponse(User user, string roleName)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.userid.ToString()),
            new Claim(ClaimTypes.Name, user.login),
            new Claim(ClaimTypes.Role, roleName)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(6),
            signingCredentials: creds
        );

        return new
        {
            Token = new JwtSecurityTokenHandler().WriteToken(token),
            Expires = token.ValidTo
        };
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDTO model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await _context.Users
        .Include(u => u.role)
        .Include(u => u.person)
        .FirstOrDefaultAsync(u => u.login == model.Login);


        if (user == null)
            return BadRequest(new { Message = "User doesn't exist" });

        var result = _passwordHasher.VerifyHashedPassword(user, user.passwordhash, model.Password);
        if (result != PasswordVerificationResult.Success)
            return BadRequest(new { Message = "Invalid password" });

        dynamic tokenResponse = GenerateJwtTokenResponse(user, user.role?.rolename ?? "User");

        return Ok(new
        {
            token = tokenResponse.Token,
            expires = tokenResponse.Expires,
            user = new
            {
                id = user.userid,
                login = user.login,
                firstName = user.person?.firstname,
                lastName = user.person?.lastname,
                email = user.person?.email,
                role = user.role?.rolename
            }
        });

    }
}