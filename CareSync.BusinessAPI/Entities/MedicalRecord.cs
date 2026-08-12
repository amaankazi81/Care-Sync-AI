using System.ComponentModel.DataAnnotations.Schema;

namespace CareSync.BusinessAPI.Entities;

public class MedicalRecord : BaseEntity
{
    public Guid AppointmentId { get; set; }

    public DateTime VisitDate { get; set; }

    public string Diagnosis { get; set; } = string.Empty;

    public string Symptoms { get; set; } = string.Empty;

    public string Treatment { get; set; } = string.Empty;

    public string DoctorNotes { get; set; } = string.Empty;

    [ForeignKey(nameof(AppointmentId))]
    public Appointment Appointment { get; set; } = null!;
}