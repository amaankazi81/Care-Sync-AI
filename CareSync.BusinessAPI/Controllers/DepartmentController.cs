using CareSync.BusinessAPI.DTOs.Department;
using CareSync.BusinessAPI.Helpers;
using CareSync.BusinessAPI.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CareSync.BusinessAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DepartmentController : ControllerBase
{
    private readonly IDepartmentService _departmentService;

    public DepartmentController(IDepartmentService departmentService)
    {
        _departmentService = departmentService;
    }

    // GET: api/department
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var departments = await _departmentService.GetAllAsync();

        return Ok(new ApiResponse<IEnumerable<DepartmentDto>>
        {
            Success = true,
            Message = "Departments fetched successfully.",
            Data = departments
        });
    }

    // GET: api/department/{id}
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var department = await _departmentService.GetByIdAsync(id);

        if (department == null)
        {
            return NotFound(new ApiErrorResponse
            {
                Message = "Department not found."
            });
        }

        return Ok(new ApiResponse<DepartmentDto>
        {
            Success = true,
            Message = "Department fetched successfully.",
            Data = department
        });
    }

    // POST: api/department
    [HttpPost]
    public async Task<IActionResult> Create(CreateDepartmentDto dto)
    {
        var department = await _departmentService.CreateAsync(dto);

        return CreatedAtAction(
            nameof(GetById),
            new { id = department.Id },
            new ApiResponse<DepartmentDto>
            {
                Success = true,
                Message = "Department created successfully.",
                Data = department
            });
    }

    // PUT: api/department/{id}
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateDepartmentDto dto)
    {
        var updated = await _departmentService.UpdateAsync(id, dto);

        if (!updated)
        {
            return NotFound(new ApiErrorResponse
            {
                Message = "Department not found."
            });
        }

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Department updated successfully."
        });
    }

    // DELETE: api/department/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _departmentService.DeleteAsync(id);

        if (!deleted)
        {
            return NotFound(new ApiErrorResponse
            {
                Message = "Department not found."
            });
        }

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Department deleted successfully."
        });
    }
}