namespace CareSync.BusinessAPI.DTOs.MedicalRecord;

public class MedicalRecordDto
{
    public Guid Id { get; set; }

    public Guid AppointmentId { get; set; }

    public string PatientName { get; set; } = string.Empty;

    public string DoctorName { get; set; } = string.Empty;

    public DateTime VisitDate { get; set; }

    public string Diagnosis { get; set; } = string.Empty;

    public string Symptoms { get; set; } = string.Empty;

    public string Treatment { get; set; } = string.Empty;

    public string DoctorNotes { get; set; } = string.Empty;
}