// using CareSync.BusinessAPI.Enums;

namespace CareSync.BusinessAPI.Entities;

public class Doctor : BaseEntity
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

    public Department? Department { get; set; }
}