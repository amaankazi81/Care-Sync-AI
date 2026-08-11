using CareSync.BusinessAPI.DTOs.Appointment;
using CareSync.BusinessAPI.Helpers;
using CareSync.BusinessAPI.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CareSync.BusinessAPI.Controllers;

[ApiController]
[Route("api/doctor/appointments")]
public class DoctorAppointmentController : ControllerBase
{
    private readonly IAppointmentService _appointmentService;

    public DoctorAppointmentController(IAppointmentService appointmentService)
    {
        _appointmentService = appointmentService;
    }

    [HttpGet("{doctorId:guid}")]
    public async Task<IActionResult> Get(Guid doctorId)
    {
        var appointments =
            await _appointmentService.GetByDoctorAsync(doctorId);

        return Ok(new ApiResponse<IEnumerable<AppointmentDto>>
        {
            Success = true,
            Message = "Doctor appointments fetched successfully.",
            Data = appointments
        });
    }
}