using CareSync.BusinessAPI.Entities;

namespace CareSync.BusinessAPI.Interfaces;

public interface IPatientRepository
{
    Task<IEnumerable<Patient>> GetAllAsync();

    Task<Patient?> GetByIdAsync(Guid id);

    Task<IEnumerable<Patient>> SearchAsync(string search);

    Task<bool> EmailExistsAsync(string email);

    Task AddAsync(Patient patient);

    void Update(Patient patient);

    void Delete(Patient patient);

    Task SaveAsync();
}