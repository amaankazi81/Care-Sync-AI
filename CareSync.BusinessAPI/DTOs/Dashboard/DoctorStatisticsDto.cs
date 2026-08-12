namespace CareSync.BusinessAPI.DTOs.Dashboard;

public class DoctorStatisticsDto
{
    public Guid DoctorId { get; set; }

    public string DoctorName { get; set; } = string.Empty;

    public int AppointmentCount { get; set; }
}