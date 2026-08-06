using CareSync.BusinessAPI.DTOs.Patient;

namespace CareSync.BusinessAPI.Interfaces;

public interface IPatientService
{
    Task<IEnumerable<PatientDto>> GetAllAsync();

    Task<PatientDto?> GetByIdAsync(Guid id);

    Task<IEnumerable<PatientDto>> SearchAsync(string search);

    Task<PatientDto> CreateAsync(CreatePatientDto dto);

    Task<bool> UpdateAsync(Guid id, UpdatePatientDto dto);

    Task<bool> DeleteAsync(Guid id);
}