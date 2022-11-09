using System.Text;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Mvc;
using ToDo.Models;
using ToDo.DTOs;

namespace ToDo.Controllers;
[ApiController]
[Route("[controller]")]
public class TokensController : ControllerBase
{
    private readonly ILogger<TokensController> _logger;

    public TokensController(ILogger<TokensController> logger)
    {
        _logger = logger;
    }
    
    [HttpPost]
    public IActionResult Post([FromBody] DTOs.Login data)
    {
        var db = new ToDoDbContext();

        var user = db.User.Find(data.Id);
        if (user == null) return Unauthorized();

        string hash = Convert.ToBase64String(
            KeyDerivation.Pbkdf2(
                password: data.Password,
                salt: Convert.FromBase64String(user.Salt),
                prf: KeyDerivationPrf.HMACSHA1,
                iterationCount: 10000,
                numBytesRequested: 256 / 8
            )
        );
        if (user.Password != hash) return Unauthorized();

        var desc = new SecurityTokenDescriptor();
        desc.Subject = new ClaimsIdentity(
            new Claim[] {
                new Claim(ClaimTypes.Name, user.Id),
                new Claim(ClaimTypes.Role, "user")
            }
        );
        desc.NotBefore = DateTime.UtcNow;
        desc.Expires = DateTime.UtcNow.AddHours(3);
        desc.IssuedAt = DateTime.UtcNow;
        desc.Issuer = "ToDoApp"; // any string is ok
        desc.Audience = "public"; // any string is ok
        desc.SigningCredentials = new SigningCredentials(
            new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(Program.SecurityKey)
            ),
            SecurityAlgorithms.HmacSha256Signature
        );
        var handler = new JwtSecurityTokenHandler();
        var token = handler.CreateToken(desc);
        
        return Ok(new { token = handler.WriteToken(token) });
    }
}
