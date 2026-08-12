using CareSync.BusinessAPI.DTOs.Prescription;
using FluentValidation;

namespace CareSync.BusinessAPI.Validators.Prescription;

public class CreatePrescriptionValidator
    : AbstractValidator<CreatePrescriptionDto>
{
    public CreatePrescriptionValidator()
    {
        RuleFor(x => x.AppointmentId)
            .NotEmpty();

        RuleFor(x => x.Diagnosis)
            .NotEmpty()
            .MaximumLength(1000);

        RuleFor(x => x.Medicines)
            .NotEmpty()
            .MaximumLength(3000);

        RuleFor(x => x.Instructions)
            .NotEmpty()
            .MaximumLength(3000);
    }
}