namespace CareSync.BusinessAPI.DTOs.Doctor;

public class CreateDoctorDto
{
    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;

    public string Gender { get; set; } = string.Empty;

    public string Specialization { get; set; } = string.Empty;

    public string Qualification { get; set; } = string.Empty;

    public int Experience { get; set; }

    public string RoomNumber { get; set; } = string.Empty;

    public bool IsAvailable { get; set; } = true;

    public Guid DepartmentId { get; set; }
}