namespace CareSync.BusinessAPI.DTOs.Billing;

public class CreateBillingDto
{
    public Guid AppointmentId { get; set; }

    public decimal ConsultationFee { get; set; }

    public decimal MedicineCharges { get; set; }

    public decimal LabCharges { get; set; }

    public decimal OtherCharges { get; set; }

    public decimal PaidAmount { get; set; }

    public string PaymentMethod { get; set; } = "Cash";
}