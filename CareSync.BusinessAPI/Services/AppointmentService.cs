using AutoMapper;
using CareSync.BusinessAPI.Data;
using CareSync.BusinessAPI.DTOs.Appointment;
using CareSync.BusinessAPI.Entities;
using CareSync.BusinessAPI.Interfaces;

namespace CareSync.BusinessAPI.Services;

public class AppointmentService : IAppointmentService
{
    private readonly IAppointmentRepository _repository;
    private readonly IMapper _mapper;

    public AppointmentService(
        IAppointmentRepository repository,
        IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<AppointmentDto>> GetAllAsync()
    {
        return _mapper.Map<IEnumerable<AppointmentDto>>(
            await _repository.GetAllAsync());
    }

    public async Task<AppointmentDto?> GetByIdAsync(Guid id)
    {
        var appointment = await _repository.GetByIdAsync(id);

        return appointment == null
            ? null
            : _mapper.Map<AppointmentDto>(appointment);
    }

    public async Task<IEnumerable<AppointmentDto>> GetByDoctorAsync(Guid doctorId)
    {
        return _mapper.Map<IEnumerable<AppointmentDto>>(
            await _repository.GetByDoctorAsync(doctorId));
    }

    public async Task<IEnumerable<AppointmentDto>> GetByPatientAsync(Guid patientId)
    {
        return _mapper.Map<IEnumerable<AppointmentDto>>(
            await _repository.GetByPatientAsync(patientId));
    }

    public async Task<AppointmentDto> CreateAsync(CreateAppointmentDto dto)
    {
        if (!await _repository.DoctorExistsAsync(dto.DoctorId))
            throw new Exception("Doctor not found.");

        if (!await _repository.PatientExistsAsync(dto.PatientId))
            throw new Exception("Patient not found.");

        if (dto.AppointmentDate < DateOnly.FromDateTime(DateTime.Today))
            throw new Exception("Cannot book appointment in the past.");

        var available = await _repository.IsDoctorAvailableAsync(
            dto.DoctorId,
            dto.AppointmentDate,
            dto.AppointmentTime);

        if (!available)
            throw new Exception("Doctor already has an appointment at this time.");

        var appointment = _mapper.Map<Appointment>(dto);

        appointment.Status = "BOOKED";

        appointment.AppointmentNumber =
            $"APT-{DateTime.Now:yyyyMMddHHmmss}";

        await _repository.AddAsync(appointment);

        await _repository.SaveAsync();

        return _mapper.Map<AppointmentDto>(appointment);
    }

    public async Task<bool> UpdateAsync(Guid id, UpdateAppointmentDto dto)
    {
        var appointment = await _repository.GetByIdAsync(id);

        if (appointment == null)
            return false;

        _mapper.Map(dto, appointment);

        _repository.Update(appointment);

        await _repository.SaveAsync();

        return true;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var appointment = await _repository.GetByIdAsync(id);

        if (appointment == null)
            return false;

        _repository.Delete(appointment);

        await _repository.SaveAsync();

        return true;
    }
}