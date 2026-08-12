namespace CareSync.BusinessAPI.DTOs.Patient;

public class PatientDto
{
    public Guid Id { get; set; }

    public string FirstName { get; set; } = "";

    public string LastName { get; set; } = "";

    public DateOnly DateOfBirth { get; set; }

    public string Gender { get; set; } = "";

    public string BloodGroup { get; set; } = "";

    public string Email { get; set; } = "";

    public string Phone { get; set; } = "";

    public string Address { get; set; } = "";

    public string EmergencyContactName { get; set; } = "";

    public string EmergencyContactNumber { get; set; } = "";
}