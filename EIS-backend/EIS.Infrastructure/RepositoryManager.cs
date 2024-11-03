using EIS.Domain.IRepository;
using EIS.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EIS.Infrastructure
{
    public class RepositoryManager(ApplicationDbContext repositoryContext) : IRepositoryManager
    {
        private readonly ApplicationDbContext _repositoryContext = repositoryContext;

        public async Task SaveAsync()
        {
            _repositoryContext.ChangeTracker.AutoDetectChangesEnabled = false;
            await _repositoryContext.SaveChangesAsync();
        }
    }
}
