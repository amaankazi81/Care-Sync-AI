using System.ComponentModel.DataAnnotations.Schema;

namespace CareSync.BusinessAPI.Entities;

public class Billing : BaseEntity
{
    public Guid AppointmentId { get; set; }

    public string InvoiceNumber { get; set; } = string.Empty;

    public decimal ConsultationFee { get; set; }

    public decimal MedicineCharges { get; set; }

    public decimal LabCharges { get; set; }

    public decimal OtherCharges { get; set; }

    public decimal TotalAmount { get; set; }

    public decimal PaidAmount { get; set; }

    public decimal DueAmount { get; set; }

    public string PaymentStatus { get; set; } = "Pending";

    public string PaymentMethod { get; set; } = "Cash";

    public DateTime BillDate { get; set; }

    [ForeignKey(nameof(AppointmentId))]
    public Appointment Appointment { get; set; } = null!;
}