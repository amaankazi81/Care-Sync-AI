using CareSync.BusinessAPI.DTOs.Dashboard;

namespace CareSync.BusinessAPI.Interfaces;

public interface IDashboardService
{
    Task<DashboardSummaryDto> GetDashboardSummaryAsync();

    Task<IEnumerable<RecentAppointmentDto>> GetRecentAppointmentsAsync();

    Task<IEnumerable<DepartmentStatisticsDto>> GetDepartmentStatisticsAsync();

    Task<IEnumerable<DoctorStatisticsDto>> GetDoctorStatisticsAsync();

    Task<IEnumerable<RevenueChartDto>> GetMonthlyRevenueAsync();
}