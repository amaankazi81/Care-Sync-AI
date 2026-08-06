using CareSync.BusinessAPI.DTOs.Doctor;
using CareSync.BusinessAPI.Helpers;
using CareSync.BusinessAPI.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CareSync.BusinessAPI.Controllers;

[ApiController]
[Route("api/doctors")]
public class DoctorController : ControllerBase
{
    private readonly IDoctorService _doctorService;

    public DoctorController(IDoctorService doctorService)
    {
        _doctorService = doctorService;
    }

    // GET: api/doctors
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? search,
        [FromQuery] Guid? departmentId,
        [FromQuery] bool? available)
    {
        if (!string.IsNullOrWhiteSpace(search))
        {
            var result = await _doctorService.SearchAsync(search);

            return Ok(new ApiResponse<IEnumerable<DoctorDto>>
            {
                Success = true,
                Message = "Doctors fetched successfully.",
                Data = result
            });
        }

        if (departmentId.HasValue)
        {
            var result = await _doctorService.GetByDepartmentAsync(departmentId.Value);

            return Ok(new ApiResponse<IEnumerable<DoctorDto>>
            {
                Success = true,
                Message = "Doctors fetched successfully.",
                Data = result
            });
        }

        if (available == true)
        {
            var result = await _doctorService.GetAvailableDoctorsAsync();

            return Ok(new ApiResponse<IEnumerable<DoctorDto>>
            {
                Success = true,
                Message = "Available doctors fetched successfully.",
                Data = result
            });
        }

        var doctors = await _doctorService.GetAllAsync();

        return Ok(new ApiResponse<IEnumerable<DoctorDto>>
        {
            Success = true,
            Message = "Doctors fetched successfully.",
            Data = doctors
        });
    }

    // GET: api/doctors/{id}
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var doctor = await _doctorService.GetByIdAsync(id);

        if (doctor == null)
        {
            return NotFound(new ApiErrorResponse
            {
                Message = "Doctor not found."
            });
        }

        return Ok(new ApiResponse<DoctorDto>
        {
            Success = true,
            Message = "Doctor fetched successfully.",
            Data = doctor
        });
    }

    // POST: api/doctors
    [HttpPost]
    public async Task<IActionResult> Create(CreateDoctorDto dto)
    {
        var doctor = await _doctorService.CreateAsync(dto);

        return CreatedAtAction(
            nameof(GetById),
            new { id = doctor.Id },
            new ApiResponse<DoctorDto>
            {
                Success = true,
                Message = "Doctor created successfully.",
                Data = doctor
            });
    }

    // PUT: api/doctors/{id}
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateDoctorDto dto)
    {
        var updated = await _doctorService.UpdateAsync(id, dto);

        if (!updated)
        {
            return NotFound(new ApiErrorResponse
            {
                Message = "Doctor not found."
            });
        }

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Doctor updated successfully."
        });
    }

    // DELETE: api/doctors/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _doctorService.DeleteAsync(id);

        if (!deleted)
        {
            return NotFound(new ApiErrorResponse
            {
                Message = "Doctor not found."
            });
        }

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Doctor deleted successfully."
        });
    }
}