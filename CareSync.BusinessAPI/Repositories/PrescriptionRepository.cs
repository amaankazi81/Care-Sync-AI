using CareSync.BusinessAPI.Data;
using CareSync.BusinessAPI.Entities;
using CareSync.BusinessAPI.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CareSync.BusinessAPI.Repositories;

public class PrescriptionRepository : IPrescriptionRepository
{
    private readonly ApplicationDbContext _context;

    public PrescriptionRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Prescription>> GetAllAsync()
    {
        return await _context.Prescriptions
            .Include(p => p.Appointment)
                .ThenInclude(a => a.Patient)
            .Include(p => p.Appointment)
                .ThenInclude(a => a.Doctor)
            .Where(p => !p.IsDeleted)
            .ToListAsync();
    }

    public async Task<Prescription?> GetByIdAsync(Guid id)
    {
        return await _context.Prescriptions
            .Include(p => p.Appointment)
                .ThenInclude(a => a.Patient)
            .Include(p => p.Appointment)
                .ThenInclude(a => a.Doctor)
            .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted);
    }

    public async Task<Prescription?> GetByAppointmentIdAsync(Guid appointmentId)
    {
        return await _context.Prescriptions
            .Include(p => p.Appointment)
                .ThenInclude(a => a.Patient)
            .Include(p => p.Appointment)
                .ThenInclude(a => a.Doctor)
            .FirstOrDefaultAsync(p =>
                p.AppointmentId == appointmentId &&
                !p.IsDeleted);
    }

    public async Task AddAsync(Prescription prescription)
    {
        await _context.Prescriptions.AddAsync(prescription);
    }

    public void Update(Prescription prescription)
    {
        _context.Prescriptions.Update(prescription);
    }

    public void Delete(Prescription prescription)
    {
        prescription.IsDeleted = true;
        prescription.UpdatedAt = DateTime.UtcNow;
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }

    public async Task<bool> AppointmentExistsAsync(Guid appointmentId)
    {
        return await _context.Appointments
            .AnyAsync(a =>
                a.Id == appointmentId &&
                !a.IsDeleted);
    }
}