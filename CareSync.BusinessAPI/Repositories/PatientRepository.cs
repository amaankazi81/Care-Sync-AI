using CareSync.BusinessAPI.Data;
using CareSync.BusinessAPI.Entities;
using CareSync.BusinessAPI.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CareSync.BusinessAPI.Repositories;

public class PatientRepository : IPatientRepository
{
    private readonly ApplicationDbContext _context;

    public PatientRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Patient>> GetAllAsync()
    {
        return await _context.Patients
            .Where(x => !x.IsDeleted)
            .ToListAsync();
    }

    public async Task<Patient?> GetByIdAsync(Guid id)
    {
        return await _context.Patients
            .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);
    }

    public async Task<IEnumerable<Patient>> SearchAsync(string search)
    {
        search = search.ToLower();

        return await _context.Patients
            .Where(x =>
                !x.IsDeleted &&
                (
                    x.FirstName.ToLower().Contains(search) ||
                    x.LastName.ToLower().Contains(search) ||
                    x.Phone.Contains(search) ||
                    x.Email.ToLower().Contains(search)
                ))
            .ToListAsync();
    }

    public async Task<bool> EmailExistsAsync(string email)
    {
        return await _context.Patients
            .AnyAsync(x =>
                x.Email == email &&
                !x.IsDeleted);
    }

    public async Task AddAsync(Patient patient)
    {
        await _context.Patients.AddAsync(patient);
    }

    public void Update(Patient patient)
    {
        _context.Patients.Update(patient);
    }

    public void Delete(Patient patient)
    {
        patient.IsDeleted = true;
        _context.Patients.Update(patient);
    }

    public async Task SaveAsync()
    {
        await _context.SaveChangesAsync();
    }
}