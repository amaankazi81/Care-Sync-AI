using CareSync.BusinessAPI.DTOs.Billing;
using CareSync.BusinessAPI.Helpers;
using CareSync.BusinessAPI.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CareSync.BusinessAPI.Controllers;

[ApiController]
[Route("api/billings")]
public class BillingController : ControllerBase
{
    private readonly IBillingService _service;

    public BillingController(IBillingService service)
    {
        _service = service;
    }

    // GET: api/billings
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var bills = await _service.GetAllAsync();

        return Ok(new ApiResponse<IEnumerable<BillingDto>>
        {
            Success = true,
            Message = "Bills fetched successfully.",
            Data = bills
        });
    }

    // GET: api/billings/{id}
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var bill = await _service.GetByIdAsync(id);

        if (bill == null)
        {
            return NotFound(new ApiErrorResponse
            {
                Message = "Bill not found."
            });
        }

        return Ok(new ApiResponse<BillingDto>
        {
            Success = true,
            Message = "Bill fetched successfully.",
            Data = bill
        });
    }

    // POST: api/billings
    [HttpPost]
    public async Task<IActionResult> Create(CreateBillingDto dto)
    {
        var bill = await _service.CreateAsync(dto);

        return CreatedAtAction(
            nameof(GetById),
            new { id = bill.Id },
            new ApiResponse<BillingDto>
            {
                Success = true,
                Message = "Bill created successfully.",
                Data = bill
            });
    }

    // PUT: api/billings/{id}
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        UpdateBillingDto dto)
    {
        var updated = await _service.UpdateAsync(id, dto);

        if (!updated)
        {
            return NotFound(new ApiErrorResponse
            {
                Message = "Bill not found."
            });
        }

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Bill updated successfully."
        });
    }

    // DELETE: api/billings/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _service.DeleteAsync(id);

        if (!deleted)
        {
            return NotFound(new ApiErrorResponse
            {
                Message = "Bill not found."
            });
        }

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Bill deleted successfully."
        });
    }
}