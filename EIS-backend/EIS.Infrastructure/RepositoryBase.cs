using EIS.Domain.IRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Linq.Expressions;
using EIS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EIS.Infrastructure
{
    public class RepositoryBase<T>(ApplicationDbContext repositoryContext) : IRepositoryBase<T> where T : class
    {
        protected ApplicationDbContext _repositoryContext = repositoryContext;

        public void Create(T entity) => _repositoryContext.Set<T>().Add(entity);

        public void Delete(T entity) => _repositoryContext.Set<T>().Remove(entity);

        public IQueryable<T> FindAll(bool trackChanges = false) => 
            !trackChanges ? 
            _repositoryContext.Set<T>()
                .AsNoTracking() : 
            _repositoryContext.Set<T>();

        public IQueryable<T> FindByCondition(Expression<Func<T, bool>> expression, bool trackChanges = false) =>
            !trackChanges ?
            _repositoryContext.Set<T>()
                .Where(expression)
                .AsNoTracking() :
            _repositoryContext.Set<T>()
                .Where(expression);

        public void Update(T entity) => _repositoryContext.Set<T>().Update(entity);
    }
}
