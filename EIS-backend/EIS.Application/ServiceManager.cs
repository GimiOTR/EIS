using AutoMapper;
using EIS.Application.IService;
using EIS.Domain.IRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EIS.Application
{
    public class ServiceManager(IRepositoryManager repositoryManager, IMapper mapper) : IServiceManager
    {
        private readonly Lazy<ICourseService> _courseService = new(() => new CourseService(repositoryManager, mapper));
        private readonly Lazy<IProgramService> _programService = new(() => new ProgramService(repositoryManager, mapper));
        private readonly Lazy<IAcademicYearService> _academicYearService = new(() => new AcademicYearService(repositoryManager, mapper));
        private readonly Lazy<ICourseProgramService> _courseProgramService = new(() => new CourseProgramService(repositoryManager));

        public ICourseService CourseService => _courseService.Value;

        public IProgramService ProgramService => _programService.Value;

        public IAcademicYearService AcademicYearService => _academicYearService.Value;

        public ICourseProgramService CourseProgramService => _courseProgramService.Value;
    }
}
