namespace CareSync.BusinessAPI.DTOs.Dashboard;

public class DepartmentStatisticsDto
{
    public string DepartmentName { get; set; } = string.Empty;

    public int DoctorCount { get; set; }

    public int AppointmentCount { get; set; }
}