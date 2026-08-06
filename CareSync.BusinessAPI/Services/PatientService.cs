using AutoMapper;
using CareSync.BusinessAPI.DTOs.Patient;
using CareSync.BusinessAPI.Entities;
using CareSync.BusinessAPI.Helpers;
using CareSync.BusinessAPI.Interfaces;

namespace CareSync.BusinessAPI.Services;

public class PatientService : IPatientService
{
    private readonly IPatientRepository _repository;
    private readonly IMapper _mapper;
    private readonly EncryptionHelper _encryption;

    public PatientService(
        IPatientRepository repository,
        IMapper mapper,
        EncryptionHelper encryption)
    {
        _repository = repository;
        _mapper = mapper;
        _encryption = encryption;
    }

    public async Task<IEnumerable<PatientDto>> GetAllAsync()
    {
        var patients = await _repository.GetAllAsync();

        foreach (var patient in patients)
        {
            patient.Phone = _encryption.Decrypt(patient.Phone);
            patient.Address = _encryption.Decrypt(patient.Address);
            patient.EmergencyContactNumber =
                _encryption.Decrypt(patient.EmergencyContactNumber);
        }

        return _mapper.Map<IEnumerable<PatientDto>>(patients);
    }

    public async Task<PatientDto?> GetByIdAsync(Guid id)
    {
        var patient = await _repository.GetByIdAsync(id);

        if (patient == null)
            return null;

        patient.Phone = _encryption.Decrypt(patient.Phone);
        patient.Address = _encryption.Decrypt(patient.Address);
        patient.EmergencyContactNumber =
            _encryption.Decrypt(patient.EmergencyContactNumber);

        return _mapper.Map<PatientDto>(patient);
    }

    public async Task<IEnumerable<PatientDto>> SearchAsync(string search)
    {
        var patients = await _repository.SearchAsync(search);

        foreach (var patient in patients)
        {
            patient.Phone = _encryption.Decrypt(patient.Phone);
            patient.Address = _encryption.Decrypt(patient.Address);
            patient.EmergencyContactNumber =
                _encryption.Decrypt(patient.EmergencyContactNumber);
        }

        return _mapper.Map<IEnumerable<PatientDto>>(patients);
    }

    public async Task<PatientDto> CreateAsync(CreatePatientDto dto)
    {
        if (await _repository.EmailExistsAsync(dto.Email))
            throw new Exception("Patient email already exists.");

        var patient = _mapper.Map<Patient>(dto);

        patient.Phone = _encryption.Encrypt(dto.Phone);
        patient.Address = _encryption.Encrypt(dto.Address);
        patient.EmergencyContactNumber =
            _encryption.Encrypt(dto.EmergencyContactNumber);

        await _repository.AddAsync(patient);

        await _repository.SaveAsync();

        patient.Phone = dto.Phone;
        patient.Address = dto.Address;
        patient.EmergencyContactNumber =
            dto.EmergencyContactNumber;

        return _mapper.Map<PatientDto>(patient);
    }

    public async Task<bool> UpdateAsync(Guid id, UpdatePatientDto dto)
    {
        var patient = await _repository.GetByIdAsync(id);

        if (patient == null)
            return false;

        if (patient.Email != dto.Email)
        {
            if (await _repository.EmailExistsAsync(dto.Email))
                throw new Exception("Patient email already exists.");
        }

        _mapper.Map(dto, patient);

        patient.Phone = _encryption.Encrypt(dto.Phone);
        patient.Address = _encryption.Encrypt(dto.Address);
        patient.EmergencyContactNumber =
            _encryption.Encrypt(dto.EmergencyContactNumber);

        _repository.Update(patient);

        await _repository.SaveAsync();

        return true;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var patient = await _repository.GetByIdAsync(id);

        if (patient == null)
            return false;

        _repository.Delete(patient);

        await _repository.SaveAsync();

        return true;
    }
}