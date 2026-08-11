using CareSync.BusinessAPI.Entities;
using Microsoft.EntityFrameworkCore;

namespace CareSync.BusinessAPI.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Doctor> Doctors => Set<Doctor>();

    public DbSet<Patient> Patients => Set<Patient>();

    public DbSet<Department> Departments => Set<Department>();

    public DbSet<Appointment> Appointments => Set<Appointment>();

    public DbSet<Prescription> Prescriptions => Set<Prescription>();

    public DbSet<MedicalRecord> MedicalRecords => Set<MedicalRecord>();

    public DbSet<Billing> Billings => Set<Billing>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Department>()
            .HasIndex(x => x.Name)
            .IsUnique();

        modelBuilder.Entity<Doctor>()
            .HasIndex(x => x.Email)
            .IsUnique();

        modelBuilder.Entity<Patient>()
            .HasIndex(x => x.Email)
            .IsUnique();

        modelBuilder.Entity<Doctor>()
            .HasOne(d => d.Department)
            .WithMany(dep => dep.Doctors)
            .HasForeignKey(d => d.DepartmentId);

        modelBuilder.Entity<Appointment>()
            .HasOne(a => a.Patient)
            .WithMany()
            .HasForeignKey(a => a.PatientId);

        modelBuilder.Entity<Appointment>()
            .HasOne(a => a.Doctor)
            .WithMany()
            .HasForeignKey(a => a.DoctorId);

        modelBuilder.Entity<Appointment>()
            .HasIndex(a => a.AppointmentNumber)
            .IsUnique();

        modelBuilder.Entity<Prescription>()
            .HasOne(p => p.Appointment)
            .WithOne()
            .HasForeignKey<Prescription>(p => p.AppointmentId);

        modelBuilder.Entity<Prescription>()
            .Property(p => p.Diagnosis)
            .HasMaxLength(1000);

        modelBuilder.Entity<Prescription>()
            .Property(p => p.Medicines)
            .HasMaxLength(3000);

        modelBuilder.Entity<Prescription>()
            .Property(p => p.Instructions)
            .HasMaxLength(3000);

        modelBuilder.Entity<MedicalRecord>()
            .HasOne(m => m.Appointment)
            .WithOne()
            .HasForeignKey<MedicalRecord>(m => m.AppointmentId);

        modelBuilder.Entity<MedicalRecord>()
            .Property(m => m.Diagnosis)
            .HasMaxLength(1000);

        modelBuilder.Entity<MedicalRecord>()
            .Property(m => m.Symptoms)
            .HasMaxLength(3000);

        modelBuilder.Entity<MedicalRecord>()
            .Property(m => m.Treatment)
            .HasMaxLength(3000);

        modelBuilder.Entity<MedicalRecord>()
            .Property(m => m.DoctorNotes)
            .HasMaxLength(3000);

        modelBuilder.Entity<Billing>()
            .HasOne(b => b.Appointment)
            .WithOne()
            .HasForeignKey<Billing>(b => b.AppointmentId);

        modelBuilder.Entity<Billing>()
            .HasIndex(b => b.InvoiceNumber)
            .IsUnique();

        modelBuilder.Entity<Billing>()
            .Property(b => b.InvoiceNumber)
            .HasMaxLength(50);

        modelBuilder.Entity<Billing>()
            .Property(b => b.PaymentStatus)
            .HasMaxLength(30);

        modelBuilder.Entity<Billing>()
            .Property(b => b.PaymentMethod)
            .HasMaxLength(30);

        var cardiologyId = Guid.Parse("11111111-1111-1111-1111-111111111111");
        var neurologyId = Guid.Parse("22222222-2222-2222-2222-222222222222");
        var orthopedicsId = Guid.Parse("33333333-3333-3333-3333-333333333333");
        var dermatologyId = Guid.Parse("44444444-4444-4444-4444-444444444444");

        modelBuilder.Entity<Department>().HasData(

        new Department
        {
            Id = cardiologyId,
            Name = "Cardiology",
            Description = "Heart Department",
            CreatedAt = DateTime.UtcNow
        },

        new Department
        {
            Id = neurologyId,
            Name = "Neurology",
            Description = "Brain Department",
            CreatedAt = DateTime.UtcNow
        },

        new Department
        {
            Id = orthopedicsId,
            Name = "Orthopedics",
            Description = "Bone Department",
            CreatedAt = DateTime.UtcNow
        },

        new Department
        {
            Id = dermatologyId,
            Name = "Dermatology",
            Description = "Skin Department",
            CreatedAt = DateTime.UtcNow
        }

        );
    }
}