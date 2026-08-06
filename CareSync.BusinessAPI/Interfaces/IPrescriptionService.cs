using CareSync.BusinessAPI.DTOs.Prescription;

namespace CareSync.BusinessAPI.Interfaces;

public interface IPrescriptionService
{
    Task<IEnumerable<PrescriptionDto>> GetAllAsync();

    Task<PrescriptionDto?> GetByIdAsync(Guid id);

    Task<PrescriptionDto> CreateAsync(CreatePrescriptionDto dto);

    Task<bool> UpdateAsync(Guid id, UpdatePrescriptionDto dto);

    Task<bool> DeleteAsync(Guid id);
}