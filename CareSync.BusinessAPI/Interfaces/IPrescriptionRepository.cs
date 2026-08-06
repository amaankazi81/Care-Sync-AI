using CareSync.BusinessAPI.Entities;

namespace CareSync.BusinessAPI.Interfaces;

public interface IPrescriptionRepository
{
    Task<IEnumerable<Prescription>> GetAllAsync();

    Task<Prescription?> GetByIdAsync(Guid id);

    Task<Prescription?> GetByAppointmentIdAsync(Guid appointmentId);

    Task AddAsync(Prescription prescription);

    void Update(Prescription prescription);

    void Delete(Prescription prescription);

    Task SaveChangesAsync();

    Task<bool> AppointmentExistsAsync(Guid appointmentId);
}