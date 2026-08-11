using CareSync.BusinessAPI.Entities;

namespace CareSync.BusinessAPI.Interfaces;

public interface IAppointmentRepository
{
    Task<IEnumerable<Appointment>> GetAllAsync();

    Task<Appointment?> GetByIdAsync(Guid id);

    Task<IEnumerable<Appointment>> GetByDoctorAsync(Guid doctorId);

    Task<IEnumerable<Appointment>> GetByPatientAsync(Guid patientId);

    Task<IEnumerable<Appointment>> GetTodayAppointmentsAsync();

    Task<bool> IsDoctorAvailableAsync(
        Guid doctorId,
        DateOnly date,
        TimeOnly time);

    Task AddAsync(Appointment appointment);

    void Update(Appointment appointment);

    void Delete(Appointment appointment);

    Task SaveAsync();

    Task<bool> DoctorExistsAsync(Guid doctorId);

    Task<bool> PatientExistsAsync(Guid patientId);
}