using CareSync.BusinessAPI.Entities;

namespace CareSync.BusinessAPI.Interfaces;

public interface IMedicalRecordRepository
{
    Task<IEnumerable<MedicalRecord>> GetAllAsync();

    Task<MedicalRecord?> GetByIdAsync(Guid id);

    Task<MedicalRecord?> GetByAppointmentIdAsync(Guid appointmentId);

    Task AddAsync(MedicalRecord medicalRecord);

    void Update(MedicalRecord medicalRecord);

    void Delete(MedicalRecord medicalRecord);

    Task SaveChangesAsync();

    Task<bool> AppointmentExistsAsync(Guid appointmentId);
}