using EIS.Domain.Entities;
using EIS.Domain.IRepository;
using EIS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EIS.Infrastructure
{
    public class AcademicYearRepository(ApplicationDbContext repositoryContext) : RepositoryBase<AcademicYear>(repositoryContext), IAcademicYearRepository
    {
        public void CreateRecord(AcademicYear academicYear) => Create(academicYear);

        public async Task<AcademicYear> FindByIdAsync(int id) => await FindByCondition(c => c.Id.Equals(id)).FirstOrDefaultAsync();

        public async Task<AcademicYear> FindByStartYearAsync(int startYear) => await FindByCondition(c => c.StartYear.Equals(startYear)).FirstOrDefaultAsync();

        public async Task<IEnumerable<AcademicYear>> GetAllAsync() => await FindAll().ToListAsync();

        public void UpdateRecord(AcademicYear academicYear) => Update(academicYear);
    }
}
