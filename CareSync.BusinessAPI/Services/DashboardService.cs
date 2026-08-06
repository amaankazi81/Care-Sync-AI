using CareSync.BusinessAPI.Data;
using CareSync.BusinessAPI.DTOs.Dashboard;
using CareSync.BusinessAPI.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CareSync.BusinessAPI.Services;

public class DashboardService : IDashboardService
{
    private readonly ApplicationDbContext _context;

    public DashboardService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardSummaryDto> GetDashboardSummaryAsync()
    {
        var today = DateOnly.FromDateTime(DateTime.Today);

        var monthStart = new DateTime(
            today.Year,
            today.Month,
            1);

        return new DashboardSummaryDto
        {
            TotalDoctors = await _context.Doctors
                .CountAsync(x => !x.IsDeleted),

            TotalPatients = await _context.Patients
                .CountAsync(x => !x.IsDeleted),

            TotalDepartments = await _context.Departments
                .CountAsync(x => !x.IsDeleted),

            TotalAppointments = await _context.Appointments
                .CountAsync(x => !x.IsDeleted),

            TodayAppointments = await _context.Appointments
                .CountAsync(x =>
                    !x.IsDeleted &&
                    x.AppointmentDate == today),

            CompletedAppointments = await _context.Appointments
                .CountAsync(x =>
                    !x.IsDeleted &&
                    x.Status == "COMPLETED"),

            PendingAppointments = await _context.Appointments
                .CountAsync(x =>
                    !x.IsDeleted &&
                    x.Status == "BOOKED"),

            TotalRevenue = await _context.Billings
                .Where(x => !x.IsDeleted)
                .SumAsync(x => (decimal?)x.PaidAmount) ?? 0,

            MonthlyRevenue = await _context.Billings
                .Where(x =>
                    !x.IsDeleted &&
                    x.BillDate >= monthStart)
                .SumAsync(x => (decimal?)x.PaidAmount) ?? 0
        };
    }

    public async Task<IEnumerable<RecentAppointmentDto>> GetRecentAppointmentsAsync()
    {
        return await _context.Appointments
            .Include(a => a.Patient)
            .Include(a => a.Doctor)
            .Where(a => !a.IsDeleted)
            .OrderByDescending(a => a.AppointmentDate)
            .Take(10)
            .Select(a => new RecentAppointmentDto
            {
                AppointmentId = a.Id,

                PatientName =
                    a.Patient.FirstName + " " +
                    a.Patient.LastName,

                DoctorName =
                    a.Doctor.FirstName + " " +
                    a.Doctor.LastName,

                AppointmentDate = a.AppointmentDate,

                Status = a.Status
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<DepartmentStatisticsDto>> GetDepartmentStatisticsAsync()
    {
        return await _context.Departments
            .Select(d => new DepartmentStatisticsDto
            {
                DepartmentName = d.Name,

                DoctorCount =
                    d.Doctors.Count(x => !x.IsDeleted),

                AppointmentCount  = _context.Appointments.Count(a =>
                    a.Doctor.DepartmentId == d.Id &&
                    !a.IsDeleted)
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<DoctorStatisticsDto>> GetDoctorStatisticsAsync()
    {
        return await _context.Doctors
            .Where(d => !d.IsDeleted)
            .Select(d => new DoctorStatisticsDto
            {
                DoctorId = d.Id,

                DoctorName =
                    d.FirstName + " " +
                    d.LastName,

                AppointmentCount =_context.Appointments.Count(a =>
                    a.DoctorId == d.Id &&
                    !a.IsDeleted)
            })
            .OrderByDescending(x => x.AppointmentCount)
            .ToListAsync();
    }

    public async Task<IEnumerable<RevenueChartDto>> GetMonthlyRevenueAsync()
    {
        var data = await _context.Billings
            .Where(b => !b.IsDeleted)
            .GroupBy(b => new
            {
                b.BillDate.Year,
                b.BillDate.Month
            })
            .Select(g => new
            {
                g.Key.Year,
                g.Key.Month,
                Revenue = g.Sum(x => x.PaidAmount)
            })
            .OrderBy(x => x.Year)
            .ThenBy(x => x.Month)
            .ToListAsync();

        return data.Select(x => new RevenueChartDto
        {
            Month = $"{x.Month}/{x.Year}",
            Revenue = x.Revenue
        });
    }

}