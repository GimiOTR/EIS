using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EIS.Application.IService
{
    public interface IServiceManager
    {
        ICourseService CourseService { get; }
        IProgramService ProgramService { get; }
    }
}
