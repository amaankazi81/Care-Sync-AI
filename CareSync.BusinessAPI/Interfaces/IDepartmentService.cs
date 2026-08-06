using CareSync.BusinessAPI.DTOs.Department;

namespace CareSync.BusinessAPI.Interfaces;

public interface IDepartmentService
{
    Task<IEnumerable<DepartmentDto>> GetAllAsync();

    Task<DepartmentDto?> GetByIdAsync(Guid id);

    Task<DepartmentDto> CreateAsync(CreateDepartmentDto dto);

    Task<bool> UpdateAsync(Guid id, UpdateDepartmentDto dto);

    Task<bool> DeleteAsync(Guid id);
}