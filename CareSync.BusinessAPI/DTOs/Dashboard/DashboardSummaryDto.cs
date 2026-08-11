namespace CareSync.BusinessAPI.DTOs.Dashboard;

public class DashboardSummaryDto
{
    public int TotalDoctors { get; set; }

    public int TotalPatients { get; set; }

    public int TotalDepartments { get; set; }

    public int TotalAppointments { get; set; }

    public int TodayAppointments { get; set; }

    public int CompletedAppointments { get; set; }

    public int PendingAppointments { get; set; }

    public decimal TotalRevenue { get; set; }

    public decimal MonthlyRevenue { get; set; }
}