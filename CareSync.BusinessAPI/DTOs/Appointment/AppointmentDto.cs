namespace CareSync.BusinessAPI.DTOs.Appointment;

public class AppointmentDto
{
    public Guid Id { get; set; }

    public string AppointmentNumber { get; set; } = "";

    public DateOnly AppointmentDate { get; set; }

    public TimeOnly AppointmentTime { get; set; }

    public string Status { get; set; } = "";

    public Guid PatientId { get; set; }

    public string PatientName { get; set; } = "";

    public Guid DoctorId { get; set; }

    public string DoctorName { get; set; } = "";

    public string Department { get; set; } = "";

    public string Reason { get; set; } = "";

    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}