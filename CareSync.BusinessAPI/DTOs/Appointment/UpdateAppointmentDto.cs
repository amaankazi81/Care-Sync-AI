namespace CareSync.BusinessAPI.DTOs.Appointment;

public class UpdateAppointmentDto
{
    public DateOnly AppointmentDate { get; set; }

    public TimeOnly AppointmentTime { get; set; }

    public string Status { get; set; } = "";

    public string? Notes { get; set; }
}