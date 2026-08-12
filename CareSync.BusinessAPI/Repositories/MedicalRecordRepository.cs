using CareSync.BusinessAPI.Data;
using CareSync.BusinessAPI.Entities;
using CareSync.BusinessAPI.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CareSync.BusinessAPI.Repositories;

public class MedicalRecordRepository : IMedicalRecordRepository
{
    private readonly ApplicationDbContext _context;

    public MedicalRecordRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<MedicalRecord>> GetAllAsync()
    {
        return await _context.MedicalRecords
            .Include(m => m.Appointment)
                .ThenInclude(a => a.Patient)
            .Include(m => m.Appointment)
                .ThenInclude(a => a.Doctor)
            .Where(m => !m.IsDeleted)
            .OrderByDescending(m => m.VisitDate)
            .ToListAsync();
    }

    public async Task<MedicalRecord?> GetByIdAsync(Guid id)
    {
        return await _context.MedicalRecords
            .Include(m => m.Appointment)
                .ThenInclude(a => a.Patient)
            .Include(m => m.Appointment)
                .ThenInclude(a => a.Doctor)
            .FirstOrDefaultAsync(m =>
                m.Id == id &&
                !m.IsDeleted);
    }

    public async Task<MedicalRecord?> GetByAppointmentIdAsync(Guid appointmentId)
    {
        return await _context.MedicalRecords
            .Include(m => m.Appointment)
                .ThenInclude(a => a.Patient)
            .Include(m => m.Appointment)
                .ThenInclude(a => a.Doctor)
            .FirstOrDefaultAsync(m =>
                m.AppointmentId == appointmentId &&
                !m.IsDeleted);
    }

    public async Task AddAsync(MedicalRecord medicalRecord)
    {
        await _context.MedicalRecords.AddAsync(medicalRecord);
    }

    public void Update(MedicalRecord medicalRecord)
    {
        _context.MedicalRecords.Update(medicalRecord);
    }

    public void Delete(MedicalRecord medicalRecord)
    {
        medicalRecord.IsDeleted = true;
        medicalRecord.UpdatedAt = DateTime.UtcNow;
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