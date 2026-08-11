using CareSync.BusinessAPI.DTOs.Prescription;
using CareSync.BusinessAPI.Helpers;
using CareSync.BusinessAPI.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CareSync.BusinessAPI.Controllers;

[ApiController]
[Route("api/prescriptions")]
public class PrescriptionController : ControllerBase
{
    private readonly IPrescriptionService _service;

    public PrescriptionController(IPrescriptionService service)
    {
        _service = service;
    }

    // GET: api/prescriptions
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var prescriptions = await _service.GetAllAsync();

        return Ok(new ApiResponse<IEnumerable<PrescriptionDto>>
        {
            Success = true,
            Message = "Prescriptions fetched successfully.",
            Data = prescriptions
        });
    }

    // GET: api/prescriptions/{id}
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var prescription = await _service.GetByIdAsync(id);

        if (prescription == null)
        {
            return NotFound(new ApiErrorResponse
            {
                Message = "Prescription not found."
            });
        }

        return Ok(new ApiResponse<PrescriptionDto>
        {
            Success = true,
            Message = "Prescription fetched successfully.",
            Data = prescription
        });
    }

    // POST: api/prescriptions
    [HttpPost]
    public async Task<IActionResult> Create(CreatePrescriptionDto dto)
    {
        var prescription = await _service.CreateAsync(dto);

        return CreatedAtAction(
            nameof(GetById),
            new { id = prescription.Id },
            new ApiResponse<PrescriptionDto>
            {
                Success = true,
                Message = "Prescription created successfully.",
                Data = prescription
            });
    }

    // PUT: api/prescriptions/{id}
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        UpdatePrescriptionDto dto)
    {
        var updated = await _service.UpdateAsync(id, dto);

        if (!updated)
        {
            return NotFound(new ApiErrorResponse
            {
                Message = "Prescription not found."
            });
        }

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Prescription updated successfully."
        });
    }

    // DELETE: api/prescriptions/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _service.DeleteAsync(id);

        if (!deleted)
        {
            return NotFound(new ApiErrorResponse
            {
                Message = "Prescription not found."
            });
        }

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Prescription deleted successfully."
        });
    }
}