using AutoMapper;
using CareSync.BusinessAPI.DTOs.Prescription;
using CareSync.BusinessAPI.Entities;
using CareSync.BusinessAPI.Interfaces;

namespace CareSync.BusinessAPI.Services;

public class PrescriptionService : IPrescriptionService
{
    private readonly IPrescriptionRepository _repository;
    private readonly IMapper _mapper;

    public PrescriptionService(
        IPrescriptionRepository repository,
        IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<PrescriptionDto>> GetAllAsync()
    {
        var prescriptions = await _repository.GetAllAsync();

        return _mapper.Map<IEnumerable<PrescriptionDto>>(prescriptions);
    }

    public async Task<PrescriptionDto?> GetByIdAsync(Guid id)
    {
        var prescription = await _repository.GetByIdAsync(id);

        if (prescription == null)
            return null;

        return _mapper.Map<PrescriptionDto>(prescription);
    }

    public async Task<PrescriptionDto> CreateAsync(CreatePrescriptionDto dto)
    {
        if (!await _repository.AppointmentExistsAsync(dto.AppointmentId))
            throw new Exception("Appointment not found.");

        var existing =
            await _repository.GetByAppointmentIdAsync(dto.AppointmentId);

        if (existing != null)
            throw new Exception("Prescription already exists.");

        var prescription =
            _mapper.Map<Prescription>(dto);

        prescription.Id = Guid.NewGuid();
        prescription.CreatedAt = DateTime.UtcNow;

        await _repository.AddAsync(prescription);
        await _repository.SaveChangesAsync();

        return _mapper.Map<PrescriptionDto>(prescription);
    }

    public async Task<bool> UpdateAsync(
        Guid id,
        UpdatePrescriptionDto dto)
    {
        var prescription =
            await _repository.GetByIdAsync(id);

        if (prescription == null)
            return false;

        _mapper.Map(dto, prescription);

        prescription.UpdatedAt = DateTime.UtcNow;

        _repository.Update(prescription);

        await _repository.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var prescription =
            await _repository.GetByIdAsync(id);

        if (prescription == null)
            return false;

        _repository.Delete(prescription);

        await _repository.SaveChangesAsync();

        return true;
    }
}