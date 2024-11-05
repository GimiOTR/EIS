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
    public class CourseRepository(ApplicationDbContext repositoryContext) : RepositoryBase<Course>(repositoryContext), ICourseRepository
    {
        public void CreateRecord(Course course) => Create(course);

        public void DeleteRecord(Course course) => Delete(course);

        public async Task<Course> FindByIdAsync(int id) => await FindByCondition(c => c.Id.Equals(id)).FirstOrDefaultAsync();

        public async Task<IEnumerable<Course>> GetAllAsync() => await FindAll().ToListAsync();

        public void UpdateRecord(Course course) => Update(course);
    }
}
