using CareSync.BusinessAPI.DTOs.Doctor;

namespace CareSync.BusinessAPI.Interfaces;

public interface IDoctorService
{
    Task<IEnumerable<DoctorDto>> GetAllAsync();

    Task<DoctorDto?> GetByIdAsync(Guid id);

    Task<DoctorDto> CreateAsync(CreateDoctorDto dto);

    Task<bool> UpdateAsync(Guid id, UpdateDoctorDto dto);

    Task<bool> DeleteAsync(Guid id);

    Task<IEnumerable<DoctorDto>> SearchAsync(string search);

    Task<IEnumerable<DoctorDto>> GetByDepartmentAsync(Guid departmentId);

    Task<IEnumerable<DoctorDto>> GetAvailableDoctorsAsync();
}