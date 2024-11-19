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
        private readonly Lazy<ICourseRepository> _courseRepository = new(() => new CourseRepository(repositoryContext));
        private readonly Lazy<IProgramRepository> _programRepository = new(() => new ProgramRepository(repositoryContext));
        private readonly Lazy<IAcademicYearRepository> _academicYearRepository = new(() => new AcademicYearRepository(repositoryContext));
        private readonly Lazy<ICourseProgramRepository> _courseProgramRepository = new(() => new CourseProgramRepository(repositoryContext));

        public ICourseRepository CourseRepository => _courseRepository.Value;

        public IProgramRepository ProgramRepository => _programRepository.Value;

        public IAcademicYearRepository AcademicYearRepository => _academicYearRepository.Value;

        public ICourseProgramRepository CourseProgramRepository => _courseProgramRepository.Value;

        public async Task SaveAsync()
        {
            repositoryContext.ChangeTracker.AutoDetectChangesEnabled = false;
            await repositoryContext.SaveChangesAsync();
        }
    }
}
