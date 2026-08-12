using AutoMapper;
using CareSync.BusinessAPI.DTOs.Department;
using CareSync.BusinessAPI.Entities;
using CareSync.BusinessAPI.Interfaces;

namespace CareSync.BusinessAPI.Services;

public class DepartmentService : IDepartmentService
{
    private readonly IGenericRepository<Department> _repository;

    private readonly IMapper _mapper;

    public DepartmentService(
        IGenericRepository<Department> repository,
        IMapper mapper)
    {
        _repository = repository;

        _mapper = mapper;
    }

    public async Task<IEnumerable<DepartmentDto>> GetAllAsync()
    {
        var departments = await _repository.GetAllAsync();

        return _mapper.Map<IEnumerable<DepartmentDto>>(departments);
    }

    public async Task<DepartmentDto?> GetByIdAsync(Guid id)
    {
        var department = await _repository.GetByIdAsync(id);

        if (department == null)
            return null;

        return _mapper.Map<DepartmentDto>(department);
    }

    public async Task<DepartmentDto> CreateAsync(CreateDepartmentDto dto)
    {
        var department = _mapper.Map<Department>(dto);

        await _repository.AddAsync(department);

        await _repository.SaveAsync();

        return _mapper.Map<DepartmentDto>(department);
    }

    public async Task<bool> UpdateAsync(Guid id, UpdateDepartmentDto dto)
    {
        var department = await _repository.GetByIdAsync(id);

        if (department == null)
            return false;

        _mapper.Map(dto, department);

        _repository.Update(department);

        await _repository.SaveAsync();

        return true;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var department = await _repository.GetByIdAsync(id);

        if (department == null)
            return false;

        _repository.Delete(department);

        await _repository.SaveAsync();

        return true;
    }
}