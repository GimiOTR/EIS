using EIS.Application.DTO.Request;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EIS.Application.IService
{
    public interface ICourseProgramService
    {
        Task<BaseResponse> AddCourseForProgram(CourseProgramRequestDTO courseProgramRequestDTO);
    }
}
