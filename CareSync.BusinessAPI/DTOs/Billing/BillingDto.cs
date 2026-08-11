namespace CareSync.BusinessAPI.DTOs.Billing;

public class BillingDto
{
    public Guid Id { get; set; }

    public Guid AppointmentId { get; set; }

    public string InvoiceNumber { get; set; } = string.Empty;

    public string PatientName { get; set; } = string.Empty;

    public string DoctorName { get; set; } = string.Empty;

    public decimal ConsultationFee { get; set; }

    public decimal MedicineCharges { get; set; }

    public decimal LabCharges { get; set; }

    public decimal OtherCharges { get; set; }

    public decimal TotalAmount { get; set; }

    public decimal PaidAmount { get; set; }

    public decimal DueAmount { get; set; }

    public string PaymentStatus { get; set; } = string.Empty;

    public string PaymentMethod { get; set; } = string.Empty;

    public DateTime BillDate { get; set; }
}