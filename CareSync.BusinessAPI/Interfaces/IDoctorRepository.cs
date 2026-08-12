using CareSync.BusinessAPI.Entities;

namespace CareSync.BusinessAPI.Interfaces;

public interface IDoctorRepository
{
    Task<IEnumerable<Doctor>> GetAllAsync();

    Task<Doctor?> GetByIdAsync(Guid id);

    Task<IEnumerable<Doctor>> SearchAsync(string search);

    Task<IEnumerable<Doctor>> GetByDepartmentAsync(Guid departmentId);

    Task<IEnumerable<Doctor>> GetAvailableDoctorsAsync();

    Task AddAsync(Doctor doctor);

    void Update(Doctor doctor);

    void Delete(Doctor doctor);

    Task SaveAsync();

    Task<bool> EmailExistsAsync(string email);
}