using CareSync.BusinessAPI.DTOs.Billing;

namespace CareSync.BusinessAPI.Interfaces;

public interface IBillingService
{
    Task<IEnumerable<BillingDto>> GetAllAsync();

    Task<BillingDto?> GetByIdAsync(Guid id);

    Task<BillingDto> CreateAsync(CreateBillingDto dto);

    Task<bool> UpdateAsync(Guid id, UpdateBillingDto dto);

    Task<bool> DeleteAsync(Guid id);
}