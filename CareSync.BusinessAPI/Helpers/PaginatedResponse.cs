namespace CareSync.BusinessAPI.Helpers;

public class PaginatedResponse<T>
{
    public IEnumerable<T> Data { get; set; }
        = new List<T>();

    public int TotalRecords { get; set; }

    public int PageNumber { get; set; }

    public int PageSize { get; set; }
}