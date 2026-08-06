using CareSync.BusinessAPI.DTOs.Appointment;
using CareSync.BusinessAPI.Helpers;
using CareSync.BusinessAPI.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CareSync.BusinessAPI.Controllers;

[ApiController]
[Route("api/appointments")]
public class AppointmentController : ControllerBase
{
    private readonly IAppointmentService _appointmentService;

    public AppointmentController(IAppointmentService appointmentService)
    {
        _appointmentService = appointmentService;
    }

    // GET: api/appointments
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var appointments = await _appointmentService.GetAllAsync();

        return Ok(new ApiResponse<IEnumerable<AppointmentDto>>
        {
            Success = true,
            Message = "Appointments fetched successfully.",
            Data = appointments
        });
    }

    // GET: api/appointments/{id}
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var appointment = await _appointmentService.GetByIdAsync(id);

        if (appointment == null)
        {
            return NotFound(new ApiErrorResponse
            {
                Message = "Appointment not found."
            });
        }

        return Ok(new ApiResponse<AppointmentDto>
        {
            Success = true,
            Message = "Appointment fetched successfully.",
            Data = appointment
        });
    }

    // POST: api/appointments
    [HttpPost]
    public async Task<IActionResult> Create(CreateAppointmentDto dto)
    {
        var appointment = await _appointmentService.CreateAsync(dto);

        return CreatedAtAction(
            nameof(GetById),
            new { id = appointment.Id },
            new ApiResponse<AppointmentDto>
            {
                Success = true,
                Message = "Appointment booked successfully.",
                Data = appointment
            });
    }

    // PUT: api/appointments/{id}
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        UpdateAppointmentDto dto)
    {
        var updated = await _appointmentService.UpdateAsync(id, dto);

        if (!updated)
        {
            return NotFound(new ApiErrorResponse
            {
                Message = "Appointment not found."
            });
        }

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Appointment updated successfully."
        });
    }

    // DELETE: api/appointments/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _appointmentService.DeleteAsync(id);

        if (!deleted)
        {
            return NotFound(new ApiErrorResponse
            {
                Message = "Appointment not found."
            });
        }

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Appointment cancelled successfully."
        });
    }
}