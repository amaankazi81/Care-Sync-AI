using CareSync.BusinessAPI.Interfaces;

namespace CareSync.BusinessAPI.Entities;

public abstract class BaseEntity : IAuditableEntity
{
    public Guid Id { get; set; }

    public DateTime CreatedAt { get; set; } 

    public DateTime? UpdatedAt { get; set; }

    public bool IsDeleted { get; set; } 
}