using AutoMapper;
using CareSync.BusinessAPI.DTOs.Billing;
using CareSync.BusinessAPI.Entities;
using CareSync.BusinessAPI.Interfaces;

namespace CareSync.BusinessAPI.Services;

public class BillingService : IBillingService
{
    private readonly IBillingRepository _repository;
    private readonly IMapper _mapper;

    public BillingService(
        IBillingRepository repository,
        IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<BillingDto>> GetAllAsync()
    {
        var bills = await _repository.GetAllAsync();

        return _mapper.Map<IEnumerable<BillingDto>>(bills);
    }

    public async Task<BillingDto?> GetByIdAsync(Guid id)
    {
        var bill = await _repository.GetByIdAsync(id);

        if (bill == null)
            return null;

        return _mapper.Map<BillingDto>(bill);
    }

    public async Task<BillingDto> CreateAsync(CreateBillingDto dto)
    {
        if (!await _repository.AppointmentExistsAsync(dto.AppointmentId))
            throw new Exception("Appointment not found.");

        var existing =
            await _repository.GetByAppointmentIdAsync(dto.AppointmentId);

        if (existing != null)
            throw new Exception("Bill already exists for this appointment.");

        var bill = _mapper.Map<Billing>(dto);

        bill.Id = Guid.NewGuid();
        bill.BillDate = DateTime.UtcNow;
        bill.CreatedAt = DateTime.UtcNow;

        // Auto Invoice Number
        var count = await _repository.GetTodayBillCountAsync() + 1;
        bill.InvoiceNumber =
            $"INV-{DateTime.UtcNow:yyyyMMdd}-{count:D4}";

        // Calculate Amounts
        bill.TotalAmount =
            bill.ConsultationFee +
            bill.MedicineCharges +
            bill.LabCharges +
            bill.OtherCharges;

        bill.DueAmount =
            bill.TotalAmount - bill.PaidAmount;

        // Payment Status
        if (bill.PaidAmount == 0)
            bill.PaymentStatus = "Pending";
        else if (bill.PaidAmount >= bill.TotalAmount)
            bill.PaymentStatus = "Paid";
        else
            bill.PaymentStatus = "Partial";

        await _repository.AddAsync(bill);
        await _repository.SaveChangesAsync();

        var saved = await _repository.GetByIdAsync(bill.Id);

        return _mapper.Map<BillingDto>(saved);
    }

    public async Task<bool> UpdateAsync(Guid id, UpdateBillingDto dto)
    {
        var bill = await _repository.GetByIdAsync(id);

        if (bill == null)
            return false;

        _mapper.Map(dto, bill);

        bill.TotalAmount =
            bill.ConsultationFee +
            bill.MedicineCharges +
            bill.LabCharges +
            bill.OtherCharges;

        bill.DueAmount =
            bill.TotalAmount - bill.PaidAmount;

        if (bill.PaidAmount == 0)
            bill.PaymentStatus = "Pending";
        else if (bill.PaidAmount >= bill.TotalAmount)
            bill.PaymentStatus = "Paid";
        else
            bill.PaymentStatus = "Partial";

        bill.UpdatedAt = DateTime.UtcNow;

        _repository.Update(bill);

        await _repository.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var bill = await _repository.GetByIdAsync(id);

        if (bill == null)
            return false;

        _repository.Delete(bill);

        await _repository.SaveChangesAsync();

        return true;
    }
}