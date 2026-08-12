using CareSync.BusinessAPI.DTOs.Doctor;
using FluentValidation;

namespace CareSync.BusinessAPI.Validators.Doctor;

public class UpdateDoctorValidator : AbstractValidator<UpdateDoctorDto>
{
    public UpdateDoctorValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty()
            .MaximumLength(50);

        RuleFor(x => x.LastName)
            .NotEmpty()
            .MaximumLength(50);

        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress();

        RuleFor(x => x.Phone)
            .NotEmpty()
            .Matches(@"^[0-9]{10}$");

        RuleFor(x => x.Specialization)
            .NotEmpty();

        RuleFor(x => x.Qualification)
            .NotEmpty();

        RuleFor(x => x.Experience)
            .InclusiveBetween(0, 60);

        RuleFor(x => x.RoomNumber)
            .NotEmpty();

        RuleFor(x => x.DepartmentId)
            .NotEmpty();
    }
}