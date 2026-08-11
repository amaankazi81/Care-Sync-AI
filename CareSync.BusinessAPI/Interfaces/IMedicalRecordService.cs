using CareSync.BusinessAPI.DTOs.MedicalRecord;

namespace CareSync.BusinessAPI.Interfaces;

public interface IMedicalRecordService
{
    Task<IEnumerable<MedicalRecordDto>> GetAllAsync();

    Task<MedicalRecordDto?> GetByIdAsync(Guid id);

    Task<MedicalRecordDto> CreateAsync(CreateMedicalRecordDto dto);

    Task<bool> UpdateAsync(Guid id, UpdateMedicalRecordDto dto);

    Task<bool> DeleteAsync(Guid id);
}