using CareSync.BusinessAPI.DTOs.MedicalRecord;
using FluentValidation;

namespace CareSync.BusinessAPI.Validators.MedicalRecord;

public class UpdateMedicalRecordValidator
    : AbstractValidator<UpdateMedicalRecordDto>
{
    public UpdateMedicalRecordValidator()
    {
        RuleFor(x => x.Diagnosis)
            .NotEmpty();

        RuleFor(x => x.Symptoms)
            .NotEmpty();

        RuleFor(x => x.Treatment)
            .NotEmpty();

        RuleFor(x => x.DoctorNotes)
            .NotEmpty();
    }
}