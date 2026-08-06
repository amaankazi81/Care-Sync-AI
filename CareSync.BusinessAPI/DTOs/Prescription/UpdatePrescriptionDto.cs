namespace CareSync.BusinessAPI.DTOs.Prescription;

public class UpdatePrescriptionDto
{
    public string Diagnosis { get; set; } = string.Empty;

    public string Medicines { get; set; } = string.Empty;

    public string Instructions { get; set; } = string.Empty;

    public DateTime? FollowUpDate { get; set; }
}