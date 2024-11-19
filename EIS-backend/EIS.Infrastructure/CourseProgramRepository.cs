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
    public class CourseProgramRepository(ApplicationDbContext repositoryContext) : RepositoryBase<CourseProgram>(repositoryContext), ICourseProgramRepository
    {
        public void CreateRecord(CourseProgram courseProgram) => Create(courseProgram);

        public void DeleteRecord(CourseProgram courseProgram) => Delete(courseProgram);

        public async Task<CourseProgram> FindByIdAsync(int courseId, int programId) =>
            await FindByCondition(cp => cp.CourseId == courseId && cp.ProgramId == programId)
                .Include(cp => cp.Course)
                .Include(cp => cp.Program)
                .FirstOrDefaultAsync();

        public async Task<IEnumerable<CourseProgram>> GetAllByProgramIdAsync(int id) =>
            await FindByCondition(cp => cp.ProgramId == id)
                .Include(cp => cp.Course)
                .ToListAsync();

        public void UpdateRecord(CourseProgram courseProgram) => Update(courseProgram);
    }
}
