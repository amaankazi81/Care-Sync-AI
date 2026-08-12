using CareSync.BusinessAPI.DTOs.Dashboard;
using CareSync.BusinessAPI.Helpers;
using CareSync.BusinessAPI.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CareSync.BusinessAPI.Controllers;

[ApiController]
[Route("api/dashboard")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _service;

    public DashboardController(IDashboardService service)
    {
        _service = service;
    }

    // GET: api/dashboard/summary
    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
    {
        var summary = await _service.GetDashboardSummaryAsync();

        return Ok(new ApiResponse<DashboardSummaryDto>
        {
            Success = true,
            Message = "Dashboard summary fetched successfully.",
            Data = summary
        });
    }

    // GET: api/dashboard/recent-appointments
    [HttpGet("recent-appointments")]
    public async Task<IActionResult> GetRecentAppointments()
    {
        var appointments = await _service.GetRecentAppointmentsAsync();

        return Ok(new ApiResponse<IEnumerable<RecentAppointmentDto>>
        {
            Success = true,
            Message = "Recent appointments fetched successfully.",
            Data = appointments
        });
    }

    // GET: api/dashboard/department-statistics
    [HttpGet("department-statistics")]
    public async Task<IActionResult> GetDepartmentStatistics()
    {
        var data = await _service.GetDepartmentStatisticsAsync();

        return Ok(new ApiResponse<IEnumerable<DepartmentStatisticsDto>>
        {
            Success = true,
            Message = "Department statistics fetched successfully.",
            Data = data
        });
    }

    // GET: api/dashboard/doctor-statistics
    [HttpGet("doctor-statistics")]
    public async Task<IActionResult> GetDoctorStatistics()
    {
        var data = await _service.GetDoctorStatisticsAsync();

        return Ok(new ApiResponse<IEnumerable<DoctorStatisticsDto>>
        {
            Success = true,
            Message = "Doctor statistics fetched successfully.",
            Data = data
        });
    }

    // GET: api/dashboard/monthly-revenue
    [HttpGet("monthly-revenue")]
    public async Task<IActionResult> GetMonthlyRevenue()
    {
        var revenue = await _service.GetMonthlyRevenueAsync();

        return Ok(new ApiResponse<IEnumerable<RevenueChartDto>>
        {
            Success = true,
            Message = "Monthly revenue fetched successfully.",
            Data = revenue
        });
    }
}