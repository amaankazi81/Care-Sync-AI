using System.ComponentModel.DataAnnotations.Schema;

namespace CareSync.BusinessAPI.Entities;

public class Prescription : BaseEntity
{
    public Guid AppointmentId { get; set; }

    public string Diagnosis { get; set; } = string.Empty;

    public string Medicines { get; set; } = string.Empty;

    public string Instructions { get; set; } = string.Empty;

    public DateTime? FollowUpDate { get; set; }

    [ForeignKey(nameof(AppointmentId))]
    public Appointment Appointment { get; set; } = null!;
}