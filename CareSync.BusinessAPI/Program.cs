using System.Text;
using CareSync.BusinessAPI.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using FluentValidation;
using FluentValidation.AspNetCore;
using CareSync.BusinessAPI.Validators.Doctor;
using CareSync.BusinessAPI.Interfaces;
using CareSync.BusinessAPI.Repositories;
using CareSync.BusinessAPI.Helpers;
using CareSync.BusinessAPI.Mappings;
using CareSync.BusinessAPI.Middleware;
using CareSync.BusinessAPI.Services;

var builder = WebApplication.CreateBuilder(args);

// Database
var connectionString =
builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseMySql(
        connectionString,
        ServerVersion.AutoDetect(connectionString));
});

builder.Services.AddFluentValidationAutoValidation();

builder.Services.AddValidatorsFromAssemblyContaining<CreateDoctorValidator>();

builder.Services.AddScoped(
    typeof(IGenericRepository<>),
    typeof(GenericRepository<>));

builder.Services.AddScoped<IDepartmentService, DepartmentService>();

builder.Services.AddScoped<IDoctorRepository, DoctorRepository>();

builder.Services.AddScoped<IDoctorService, DoctorService>();

builder.Services.AddScoped<IPatientRepository, PatientRepository>();

builder.Services.AddScoped<IPatientService, PatientService>();

builder.Services.AddScoped<IAppointmentRepository, AppointmentRepository>();

builder.Services.AddScoped<IAppointmentService, AppointmentService>();

builder.Services.AddScoped<IPrescriptionRepository, PrescriptionRepository>();

builder.Services.AddScoped<IPrescriptionService, PrescriptionService>();

builder.Services.AddScoped<IMedicalRecordRepository, MedicalRecordRepository>();

builder.Services.AddScoped<IMedicalRecordService, MedicalRecordService>();

builder.Services.AddScoped<IBillingRepository, BillingRepository>();

builder.Services.AddScoped<IBillingService, BillingService>();

builder.Services.AddScoped<IDashboardService, DashboardService>();

// Controllers
builder.Services
.AddControllers()
.AddNewtonsoftJson();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactPolicy", policy =>
    {
        policy
        .WithOrigins(
            "http://localhost:3000"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

// JWT
builder.Services
.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    options.TokenValidationParameters =
        new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer =
            builder.Configuration["Jwt:Issuer"],

            ValidAudience =
            builder.Configuration["Jwt:Audience"],

            IssuerSigningKey =
            new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(
                    builder.Configuration["Jwt:Secret"]!
                ))
        };
});

builder.Services.AddAuthorization();

builder.Services.AddAutoMapper(
    typeof(AutoMapperProfile));

builder.Services.AddScoped<EncryptionHelper>();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

var app = builder.Build();

if(app.Environment.IsDevelopment())
{
    app.UseSwagger();

    app.UseSwaggerUI();
}

app.UseMiddleware<ExceptionMiddleware>();

app.UseHttpsRedirection();

app.UseCors("ReactPolicy");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();