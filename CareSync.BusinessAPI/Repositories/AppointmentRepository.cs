using CareSync.BusinessAPI.Data;
using CareSync.BusinessAPI.Entities;
using CareSync.BusinessAPI.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CareSync.BusinessAPI.Repositories;

public class AppointmentRepository : IAppointmentRepository
{
    private readonly ApplicationDbContext _context;

    public AppointmentRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Appointment>> GetAllAsync()
    {
        return await _context.Appointments
            .Include(a => a.Patient)
            .Include(a => a.Doctor)
            .ThenInclude(d => d.Department)
            .Where(a => !a.IsDeleted)
            .OrderByDescending(a => a.AppointmentDate)
            .ToListAsync();
    }

    public async Task<Appointment?> GetByIdAsync(Guid id)
    {
        return await _context.Appointments
            .Include(a => a.Patient)
            .Include(a => a.Doctor)
            .ThenInclude(d => d.Department)
            .FirstOrDefaultAsync(a =>
                a.Id == id &&
                !a.IsDeleted);
    }

    public async Task<IEnumerable<Appointment>> GetByDoctorAsync(Guid doctorId)
    {
        return await _context.Appointments
            .Include(a => a.Patient)
            .Include(a => a.Doctor)
            .ThenInclude(d => d.Department)
            .Where(a =>
                a.DoctorId == doctorId &&
                !a.IsDeleted)
            .OrderBy(a => a.AppointmentDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<Appointment>> GetByPatientAsync(Guid patientId)
    {
        return await _context.Appointments
            .Include(a => a.Patient)
            .Include(a => a.Doctor)
            .ThenInclude(d => d.Department)
            .Where(a =>
                a.PatientId == patientId &&
                !a.IsDeleted)
            .OrderByDescending(a => a.AppointmentDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<Appointment>> GetTodayAppointmentsAsync()
    {
        var today = DateOnly.FromDateTime(DateTime.Today);

        return await _context.Appointments
            .Where(a =>
                a.AppointmentDate == today &&
                !a.IsDeleted)
            .ToListAsync();
    }

    public async Task<bool> IsDoctorAvailableAsync(
        Guid doctorId,
        DateOnly date,
        TimeOnly time)
    {
        return !await _context.Appointments
            .AnyAsync(a =>
                a.DoctorId == doctorId &&
                a.AppointmentDate == date &&
                a.AppointmentTime == time &&
                a.Status != "CANCELLED" &&
                !a.IsDeleted);
    }

    public async Task AddAsync(Appointment appointment)
    {
        await _context.Appointments.AddAsync(appointment);
    }

    public void Update(Appointment appointment)
    {
        _context.Appointments.Update(appointment);
    }

    public void Delete(Appointment appointment)
    {
        appointment.IsDeleted = true;

        _context.Appointments.Update(appointment);
    }

    public async Task SaveAsync()
    {
        await _context.SaveChangesAsync();
    }


    public async Task<bool> DoctorExistsAsync(Guid doctorId)
    {
        return await _context.Doctors
            .AnyAsync(d => d.Id == doctorId && !d.IsDeleted);
    }

    public async Task<bool> PatientExistsAsync(Guid patientId)
    {
        return await _context.Patients
            .AnyAsync(p => p.Id == patientId && !p.IsDeleted);
    }    
}