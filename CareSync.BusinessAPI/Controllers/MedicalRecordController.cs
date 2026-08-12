using CareSync.BusinessAPI.DTOs.MedicalRecord;
using CareSync.BusinessAPI.Helpers;
using CareSync.BusinessAPI.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CareSync.BusinessAPI.Controllers;

[ApiController]
[Route("api/medicalrecords")]
public class MedicalRecordController : ControllerBase
{
    private readonly IMedicalRecordService _service;

    public MedicalRecordController(IMedicalRecordService service)
    {
        _service = service;
    }

    // GET: api/medicalrecords
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var records = await _service.GetAllAsync();

        return Ok(new ApiResponse<IEnumerable<MedicalRecordDto>>
        {
            Success = true,
            Message = "Medical records fetched successfully.",
            Data = records
        });
    }

    // GET: api/medicalrecords/{id}
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var record = await _service.GetByIdAsync(id);

        if (record == null)
        {
            return NotFound(new ApiErrorResponse
            {
                Message = "Medical record not found."
            });
        }

        return Ok(new ApiResponse<MedicalRecordDto>
        {
            Success = true,
            Message = "Medical record fetched successfully.",
            Data = record
        });
    }

    // POST: api/medicalrecords
    [HttpPost]
    public async Task<IActionResult> Create(CreateMedicalRecordDto dto)
    {
        var record = await _service.CreateAsync(dto);

        return CreatedAtAction(
            nameof(GetById),
            new { id = record.Id },
            new ApiResponse<MedicalRecordDto>
            {
                Success = true,
                Message = "Medical record created successfully.",
                Data = record
            });
    }

    // PUT: api/medicalrecords/{id}
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        UpdateMedicalRecordDto dto)
    {
        var updated = await _service.UpdateAsync(id, dto);

        if (!updated)
        {
            return NotFound(new ApiErrorResponse
            {
                Message = "Medical record not found."
            });
        }

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Medical record updated successfully."
        });
    }

    // DELETE: api/medicalrecords/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _service.DeleteAsync(id);

        if (!deleted)
        {
            return NotFound(new ApiErrorResponse
            {
                Message = "Medical record not found."
            });
        }

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Medical record deleted successfully."
        });
    }
}