using AutoMapper;
using CareSync.BusinessAPI.DTOs.MedicalRecord;
using CareSync.BusinessAPI.Entities;
using CareSync.BusinessAPI.Interfaces;

namespace CareSync.BusinessAPI.Services;

public class MedicalRecordService : IMedicalRecordService
{
    private readonly IMedicalRecordRepository _repository;
    private readonly IMapper _mapper;

    public MedicalRecordService(
        IMedicalRecordRepository repository,
        IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<MedicalRecordDto>> GetAllAsync()
    {
        var records = await _repository.GetAllAsync();

        return _mapper.Map<IEnumerable<MedicalRecordDto>>(records);
    }

    public async Task<MedicalRecordDto?> GetByIdAsync(Guid id)
    {
        var record = await _repository.GetByIdAsync(id);

        if (record == null)
            return null;

        return _mapper.Map<MedicalRecordDto>(record);
    }

    public async Task<MedicalRecordDto> CreateAsync(CreateMedicalRecordDto dto)
    {
        if (!await _repository.AppointmentExistsAsync(dto.AppointmentId))
            throw new Exception("Appointment not found.");

        var existing =
            await _repository.GetByAppointmentIdAsync(dto.AppointmentId);

        if (existing != null)
            throw new Exception("Medical record already exists.");

        var record = _mapper.Map<MedicalRecord>(dto);

        record.Id = Guid.NewGuid();
        record.CreatedAt = DateTime.UtcNow;

        await _repository.AddAsync(record);
        await _repository.SaveChangesAsync();

        var saved =
            await _repository.GetByIdAsync(record.Id);

        return _mapper.Map<MedicalRecordDto>(saved);
    }

    public async Task<bool> UpdateAsync(
        Guid id,
        UpdateMedicalRecordDto dto)
    {
        var record =
            await _repository.GetByIdAsync(id);

        if (record == null)
            return false;

        _mapper.Map(dto, record);

        record.UpdatedAt = DateTime.UtcNow;

        _repository.Update(record);

        await _repository.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var record =
            await _repository.GetByIdAsync(id);

        if (record == null)
            return false;

        _repository.Delete(record);

        await _repository.SaveChangesAsync();

        return true;
    }
}   