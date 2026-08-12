using CareSync.BusinessAPI.Data;
using CareSync.BusinessAPI.Entities;
using CareSync.BusinessAPI.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CareSync.BusinessAPI.Repositories;

public class BillingRepository : IBillingRepository
{
    private readonly ApplicationDbContext _context;

    public BillingRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Billing>> GetAllAsync()
    {
        return await _context.Billings
            .Include(b => b.Appointment)
                .ThenInclude(a => a.Patient)
            .Include(b => b.Appointment)
                .ThenInclude(a => a.Doctor)
            .Where(b => !b.IsDeleted)
            .OrderByDescending(b => b.BillDate)
            .ToListAsync();
    }

    public async Task<Billing?> GetByIdAsync(Guid id)
    {
        return await _context.Billings
            .Include(b => b.Appointment)
                .ThenInclude(a => a.Patient)
            .Include(b => b.Appointment)
                .ThenInclude(a => a.Doctor)
            .FirstOrDefaultAsync(b => b.Id == id && !b.IsDeleted);
    }

    public async Task<Billing?> GetByAppointmentIdAsync(Guid appointmentId)
    {
        return await _context.Billings
            .Include(b => b.Appointment)
                .ThenInclude(a => a.Patient)
            .Include(b => b.Appointment)
                .ThenInclude(a => a.Doctor)
            .FirstOrDefaultAsync(b =>
                b.AppointmentId == appointmentId &&
                !b.IsDeleted);
    }

    public async Task AddAsync(Billing billing)
    {
        await _context.Billings.AddAsync(billing);
    }

    public void Update(Billing billing)
    {
        _context.Billings.Update(billing);
    }

    public void Delete(Billing billing)
    {
        billing.IsDeleted = true;
        billing.UpdatedAt = DateTime.UtcNow;
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }

    public async Task<bool> AppointmentExistsAsync(Guid appointmentId)
    {
        return await _context.Appointments
            .AnyAsync(a => a.Id == appointmentId && !a.IsDeleted);
    }

    public async Task<int> GetTodayBillCountAsync()
    {
        var today = DateTime.UtcNow.Date;

        return await _context.Billings
            .CountAsync(b => b.BillDate.Date == today);
    }
}