using System.Linq.Expressions;

namespace CareSync.BusinessAPI.Interfaces;

public interface IGenericRepository<T>
where T : class
{
    Task<IEnumerable<T>> GetAllAsync();

    Task<T?> GetByIdAsync(Guid id);

    Task<IEnumerable<T>> FindAsync(
        Expression<Func<T, bool>> predicate);

    Task AddAsync(T entity);

    void Update(T entity);

    void Delete(T entity);

    Task SaveAsync();
}