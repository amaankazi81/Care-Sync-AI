using CareSync.BusinessAPI.DTOs.Appointment;

namespace CareSync.BusinessAPI.Interfaces;

public interface IAppointmentService
{
    Task<IEnumerable<AppointmentDto>> GetAllAsync();

    Task<AppointmentDto?> GetByIdAsync(Guid id);

    Task<IEnumerable<AppointmentDto>> GetByDoctorAsync(Guid doctorId);

    Task<IEnumerable<AppointmentDto>> GetByPatientAsync(Guid patientId);

    Task<AppointmentDto> CreateAsync(CreateAppointmentDto dto);

    Task<bool> UpdateAsync(Guid id, UpdateAppointmentDto dto);

    Task<bool> DeleteAsync(Guid id);
}