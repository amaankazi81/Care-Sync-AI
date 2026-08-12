namespace CareSync.BusinessAPI.DTOs.MedicalRecord;

public class CreateMedicalRecordDto
{
    public Guid AppointmentId { get; set; }

    public DateTime VisitDate { get; set; }

    public string Diagnosis { get; set; } = string.Empty;

    public string Symptoms { get; set; } = string.Empty;

    public string Treatment { get; set; } = string.Empty;

    public string DoctorNotes { get; set; } = string.Empty;
}