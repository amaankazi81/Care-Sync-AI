using CareSync.BusinessAPI.DTOs.Billing;
using FluentValidation;

namespace CareSync.BusinessAPI.Validators.Billing;

public class UpdateBillingValidator
    : AbstractValidator<UpdateBillingDto>
{
    public UpdateBillingValidator()
    {
        RuleFor(x => x.ConsultationFee)
            .GreaterThanOrEqualTo(0);

        RuleFor(x => x.MedicineCharges)
            .GreaterThanOrEqualTo(0);

        RuleFor(x => x.LabCharges)
            .GreaterThanOrEqualTo(0);

        RuleFor(x => x.OtherCharges)
            .GreaterThanOrEqualTo(0);

        RuleFor(x => x.PaidAmount)
            .GreaterThanOrEqualTo(0);

        RuleFor(x => x.PaymentMethod)
            .NotEmpty();
    }
}