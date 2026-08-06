using CareSync.BusinessAPI.Entities;

namespace CareSync.BusinessAPI.Interfaces;

public interface IBillingRepository
{
    Task<IEnumerable<Billing>> GetAllAsync();

    Task<Billing?> GetByIdAsync(Guid id);

    Task<Billing?> GetByAppointmentIdAsync(Guid appointmentId);

    Task AddAsync(Billing billing);

    void Update(Billing billing);

    void Delete(Billing billing);

    Task SaveChangesAsync();

    Task<bool> AppointmentExistsAsync(Guid appointmentId);

    Task<int> GetTodayBillCountAsync();
}