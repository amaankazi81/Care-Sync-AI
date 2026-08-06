using CareSync.BusinessAPI.DTOs.MedicalRecord;
using FluentValidation;

namespace CareSync.BusinessAPI.Validators.MedicalRecord;

public class CreateMedicalRecordValidator
    : AbstractValidator<CreateMedicalRecordDto>
{
    public CreateMedicalRecordValidator()
    {
        RuleFor(x => x.AppointmentId)
            .NotEmpty();

        RuleFor(x => x.Diagnosis)
            .NotEmpty()
            .MaximumLength(1000);

        RuleFor(x => x.Symptoms)
            .NotEmpty();

        RuleFor(x => x.Treatment)
            .NotEmpty();

        RuleFor(x => x.DoctorNotes)
            .NotEmpty();
    }
}