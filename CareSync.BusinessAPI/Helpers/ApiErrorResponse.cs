namespace CareSync.BusinessAPI.Helpers;

public class ApiErrorResponse
{
    public bool Success => false;

    public string Message { get; set; } = string.Empty;

    public List<string> Errors { get; set; } = new();
}