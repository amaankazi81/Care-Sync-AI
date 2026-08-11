using CareSync.BusinessAPI.DTOs.Patient;
using CareSync.BusinessAPI.Helpers;
using CareSync.BusinessAPI.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CareSync.BusinessAPI.Controllers;

[ApiController]
[Route("api/patients")]
public class PatientController : ControllerBase
{
    private readonly IPatientService _patientService;

    public PatientController(IPatientService patientService)
    {
        _patientService = patientService;
    }

    // GET: api/patients
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? search)
    {
        IEnumerable<PatientDto> patients;

        if (!string.IsNullOrWhiteSpace(search))
        {
            patients = await _patientService.SearchAsync(search);
        }
        else
        {
            patients = await _patientService.GetAllAsync();
        }

        return Ok(new ApiResponse<IEnumerable<PatientDto>>
        {
            Success = true,
            Message = "Patients fetched successfully.",
            Data = patients
        });
    }

    // GET: api/patients/{id}
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var patient = await _patientService.GetByIdAsync(id);

        if (patient == null)
        {
            return NotFound(new ApiErrorResponse
            {
                Message = "Patient not found."
            });
        }

        return Ok(new ApiResponse<PatientDto>
        {
            Success = true,
            Message = "Patient fetched successfully.",
            Data = patient
        });
    }

    // POST: api/patients
    [HttpPost]
    public async Task<IActionResult> Create(CreatePatientDto dto)
    {
        var patient = await _patientService.CreateAsync(dto);

        return CreatedAtAction(
            nameof(GetById),
            new { id = patient.Id },
            new ApiResponse<PatientDto>
            {
                Success = true,
                Message = "Patient created successfully.",
                Data = patient
            });
    }

    // PUT: api/patients/{id}
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        UpdatePatientDto dto)
    {
        var updated =
            await _patientService.UpdateAsync(id, dto);

        if (!updated)
        {
            return NotFound(new ApiErrorResponse
            {
                Message = "Patient not found."
            });
        }

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Patient updated successfully."
        });
    }

    // DELETE: api/patients/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted =
            await _patientService.DeleteAsync(id);

        if (!deleted)
        {
            return NotFound(new ApiErrorResponse
            {
                Message = "Patient not found."
            });
        }

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Patient deleted successfully."
        });
    }
}