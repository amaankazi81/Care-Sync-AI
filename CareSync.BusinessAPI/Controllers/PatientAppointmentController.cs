using CareSync.BusinessAPI.DTOs.Appointment;
using CareSync.BusinessAPI.Helpers;
using CareSync.BusinessAPI.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CareSync.BusinessAPI.Controllers;

[ApiController]
[Route("api/patient/appointments")]
public class PatientAppointmentController : ControllerBase
{
    private readonly IAppointmentService _appointmentService;

    public PatientAppointmentController(IAppointmentService appointmentService)
    {
        _appointmentService = appointmentService;
    }

    [HttpGet("{patientId:guid}")]
    public async Task<IActionResult> Get(Guid patientId)
    {
        var appointments =
            await _appointmentService.GetByPatientAsync(patientId);

        return Ok(new ApiResponse<IEnumerable<AppointmentDto>>
        {
            Success = true,
            Message = "Patient appointments fetched successfully.",
            Data = appointments
        });
    }
}