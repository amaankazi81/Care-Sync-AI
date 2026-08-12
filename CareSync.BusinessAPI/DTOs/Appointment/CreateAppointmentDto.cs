namespace CareSync.BusinessAPI.DTOs.Appointment;

public class CreateAppointmentDto
{
    public Guid PatientId { get; set; }

    public Guid DoctorId { get; set; }

    public DateOnly AppointmentDate { get; set; }

    public TimeOnly AppointmentTime { get; set; }

    public string Reason { get; set; } = "";

    public string? Notes { get; set; }
}