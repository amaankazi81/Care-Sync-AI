namespace CareSync.BusinessAPI.DTOs.Dashboard;

public class RecentAppointmentDto
{
    public Guid AppointmentId { get; set; }

    public string PatientName { get; set; } = string.Empty;

    public string DoctorName { get; set; } = string.Empty;

    public DateOnly AppointmentDate { get; set; }

    public string Status { get; set; } = string.Empty;
}