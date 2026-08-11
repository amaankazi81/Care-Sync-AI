namespace CareSync.BusinessAPI.DTOs.Prescription;

public class PrescriptionDto
{
    public Guid Id { get; set; }

    public Guid AppointmentId { get; set; }

    public string PatientName { get; set; } = string.Empty;

    public string DoctorName { get; set; } = string.Empty;

    public string Diagnosis { get; set; } = string.Empty;

    public string Medicines { get; set; } = string.Empty;

    public string Instructions { get; set; } = string.Empty;

    public DateTime? FollowUpDate { get; set; }
}