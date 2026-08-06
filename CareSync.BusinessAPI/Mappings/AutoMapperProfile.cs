using AutoMapper;
using CareSync.BusinessAPI.Entities;
using CareSync.BusinessAPI.DTOs.Department;
using CareSync.BusinessAPI.DTOs.Doctor;
using CareSync.BusinessAPI.DTOs.Patient;
using CareSync.BusinessAPI.DTOs.Appointment;
using CareSync.BusinessAPI.DTOs.Prescription;
using CareSync.BusinessAPI.DTOs.MedicalRecord;
using CareSync.BusinessAPI.DTOs.Billing;

namespace CareSync.BusinessAPI.Mappings;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {   //Department
        CreateMap<Department, DepartmentDto>();

        CreateMap<CreateDepartmentDto, Department>();

        CreateMap<UpdateDepartmentDto, Department>();

        //Doctor
        CreateMap<Doctor, DoctorDto>();

        CreateMap<CreateDoctorDto, Doctor>();

        CreateMap<UpdateDoctorDto, Doctor>();

        //Patient
        CreateMap<Patient, PatientDto>();

        CreateMap<CreatePatientDto, Patient>();

        CreateMap<UpdatePatientDto, Patient>();

        //Appoinment
        CreateMap<Appointment, AppointmentDto>()
            .ForMember(dest => dest.Status,
                opt => opt.MapFrom(src => src.Status.ToString()))
            .ForMember(dest => dest.PatientName,
                opt => opt.MapFrom(src =>
                    src.Patient!.FirstName + " " + src.Patient.LastName))
            .ForMember(dest => dest.DoctorName,
                opt => opt.MapFrom(src =>
                    src.Doctor.FirstName + " " + src.Doctor.LastName))
            .ForMember(dest => dest.Department,
                opt => opt.MapFrom(src =>
                    src.Doctor!.Department!.Name));

        CreateMap<CreateAppointmentDto, Appointment>();

        CreateMap<UpdateAppointmentDto, Appointment>();

        //Prescription
        CreateMap<Prescription, PrescriptionDto>()
            .ForMember(dest => dest.PatientName,
                opt => opt.MapFrom(src =>
                    src.Appointment.Patient.FirstName + " " +
                    src.Appointment.Patient.LastName))
            .ForMember(dest => dest.DoctorName,
                opt => opt.MapFrom(src =>
                    src.Appointment.Doctor.FirstName + " " +
                    src.Appointment.Doctor.LastName));

        CreateMap<CreatePrescriptionDto, Prescription>();

        CreateMap<UpdatePrescriptionDto, Prescription>();

        //Medical Records
        CreateMap<MedicalRecord, MedicalRecordDto>()
            .ForMember(dest => dest.PatientName,
                opt => opt.MapFrom(src =>
                    src.Appointment.Patient.FirstName + " " +
                    src.Appointment.Patient.LastName))
            .ForMember(dest => dest.DoctorName,
                opt => opt.MapFrom(src =>
                    src.Appointment.Doctor.FirstName + " " +
                    src.Appointment.Doctor.LastName));

        CreateMap<CreateMedicalRecordDto, MedicalRecord>();

        CreateMap<UpdateMedicalRecordDto, MedicalRecord>();

        //Billing
        CreateMap<Billing, BillingDto>()
            .ForMember(dest => dest.PatientName,
                opt => opt.MapFrom(src =>
                    src.Appointment.Patient.FirstName + " " +
                    src.Appointment.Patient.LastName))
            .ForMember(dest => dest.DoctorName,
                opt => opt.MapFrom(src =>
                    src.Appointment.Doctor.FirstName + " " +
                    src.Appointment.Doctor.LastName));

        CreateMap<CreateBillingDto, Billing>();

        CreateMap<UpdateBillingDto, Billing>();
    }
}