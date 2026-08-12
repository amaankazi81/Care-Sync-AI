// using CareSync.BusinessAPI.Enums;

namespace CareSync.BusinessAPI.Entities;

public class Appointment : BaseEntity
{
    public string AppointmentNumber { get; set; } = string.Empty;

    public DateOnly AppointmentDate { get; set; }

    public TimeOnly AppointmentTime { get; set; }

    public string Status { get; set; } = "BOOKED";

    public Guid PatientId { get; set; }

    public Patient Patient { get; set; } = null!;

    public Guid DoctorId { get; set; }

    public Doctor Doctor { get; set; } = null!;

    public string Reason { get; set; } = string.Empty;

    public string? Notes { get; set; }
}