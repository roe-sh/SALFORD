using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SALFORD_APP_NCIT.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowExpoWeb", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:8081",   // Expo web
                "http://10.0.2.2:8081",    // Android emulator access
                "http://localhost:19006",  // Expo dev
                "http://localhost:19000",
                "http://192.168.1.100:8081"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});


builder.Services.AddDbContext<SalfordContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("SalfordConnection")));

builder.Services.Configure<FormOptions>(o =>
{
    o.MultipartBodyLengthLimit = long.MaxValue;
});


builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

builder.Services.AddAuthorization();
Stripe.StripeConfiguration.ApiKey = builder.Configuration["Stripe:SecretKey"];

var app = builder.Build();
var logger = app.Logger;


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowExpoWeb");

app.UseAuthentication();
app.UseAuthorization();
app.UseStaticFiles();
// Map controllers
app.MapControllers();

// Run app
app.Run();
