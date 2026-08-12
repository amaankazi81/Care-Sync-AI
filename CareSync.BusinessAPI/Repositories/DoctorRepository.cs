using CareSync.BusinessAPI.Data;
using CareSync.BusinessAPI.Entities;
using CareSync.BusinessAPI.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CareSync.BusinessAPI.Repositories;

public class DoctorRepository : IDoctorRepository
{
    private readonly ApplicationDbContext _context;

    public DoctorRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Doctor>> GetAllAsync()
    {
        return await _context.Doctors
            .Include(d => d.Department)
            .Where(d => !d.IsDeleted)
            .ToListAsync();
    }

    public async Task<Doctor?> GetByIdAsync(Guid id)
    {
        return await _context.Doctors
            .Include(d => d.Department)
            .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);
    }

    public async Task<IEnumerable<Doctor>> SearchAsync(string search)
    {
        search = search.ToLower();

        return await _context.Doctors
            .Where(x =>
                !x.IsDeleted &&
                (
                    x.FirstName.ToLower().Contains(search) ||
                    x.LastName.ToLower().Contains(search) ||
                    x.Specialization.ToLower().Contains(search)
                ))
            .ToListAsync();
    }

    public async Task<IEnumerable<Doctor>> GetByDepartmentAsync(Guid departmentId)
    {
        return await _context.Doctors
            .Where(x =>
                !x.IsDeleted &&
                x.DepartmentId == departmentId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Doctor>> GetAvailableDoctorsAsync()
    {
        return await _context.Doctors
            .Where(x =>
                !x.IsDeleted &&
                x.IsAvailable)
            .ToListAsync();
    }

    public async Task AddAsync(Doctor doctor)
    {
        await _context.Doctors.AddAsync(doctor);
    }

    public void Update(Doctor doctor)
    {
        _context.Doctors.Update(doctor);
    }

    public void Delete(Doctor doctor)
    {
        doctor.IsDeleted = true;

        _context.Doctors.Update(doctor);
    }

    public async Task SaveAsync()
    {
        await _context.SaveChangesAsync();
    }

    public async Task<bool> EmailExistsAsync(string email)
    {
        return await _context.Doctors
            .AnyAsync(x =>
                x.Email == email &&
                !x.IsDeleted);
    }
}