using AutoMapper;
using CareSync.BusinessAPI.DTOs.Doctor;
using CareSync.BusinessAPI.Entities;
using CareSync.BusinessAPI.Interfaces;

namespace CareSync.BusinessAPI.Services;

public class DoctorService : IDoctorService
{
    private readonly IDoctorRepository _repository;

    private readonly IMapper _mapper;

    public DoctorService(
        IDoctorRepository repository,
        IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<DoctorDto>> GetAllAsync()
    {
        var doctors = await _repository.GetAllAsync();

        return _mapper.Map<IEnumerable<DoctorDto>>(doctors);
    }

    public async Task<DoctorDto?> GetByIdAsync(Guid id)
    {
        var doctor = await _repository.GetByIdAsync(id);

        if (doctor == null)
            return null;

        return _mapper.Map<DoctorDto>(doctor);
    }

    public async Task<DoctorDto> CreateAsync(CreateDoctorDto dto)
    {   
        if(await _repository.EmailExistsAsync(dto.Email))
        {
            throw new Exception("Doctor email already exists.");
        }
        var doctor = _mapper.Map<Doctor>(dto);

        await _repository.AddAsync(doctor);

        await _repository.SaveAsync();

        return _mapper.Map<DoctorDto>(doctor);
    }

    public async Task<bool> UpdateAsync(Guid id, UpdateDoctorDto dto)
    {
        var doctor = await _repository.GetByIdAsync(id);

        if (doctor == null)
            return false;

        if (doctor.Email != dto.Email)
        {
            if (await _repository.EmailExistsAsync(dto.Email))
            {
                throw new Exception("Doctor email already exists.");
            }
        }

        _mapper.Map(dto, doctor);

        _repository.Update(doctor);

        await _repository.SaveAsync();

        return true;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var doctor = await _repository.GetByIdAsync(id);

        if (doctor == null)
            return false;

        _repository.Delete(doctor);

        await _repository.SaveAsync();

        return true;
    }

    public async Task<IEnumerable<DoctorDto>> SearchAsync(string search)
    {
        var doctors = await _repository.SearchAsync(search);

        return _mapper.Map<IEnumerable<DoctorDto>>(doctors);
    }

    public async Task<IEnumerable<DoctorDto>> GetByDepartmentAsync(Guid departmentId)
    {
        var doctors = await _repository.GetByDepartmentAsync(departmentId);

        return _mapper.Map<IEnumerable<DoctorDto>>(doctors);
    }

    public async Task<IEnumerable<DoctorDto>> GetAvailableDoctorsAsync()
    {
        var doctors = await _repository.GetAvailableDoctorsAsync();

        return _mapper.Map<IEnumerable<DoctorDto>>(doctors);
    }
}