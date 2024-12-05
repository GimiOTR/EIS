using EIS.Application.DTO.Request;
using EIS.Application.DTO.Response;
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
        Task<BaseResponse> RemoveCourseFromProgram(string courseCode, string programCode, string programLevel);
        Task<BaseResponse> UpdateCourseForProgram(CourseProgramRequestDTO courseProgramRequestDTO);
        Task<IEnumerable<CourseProgramResponseDTO>> GetAllCoursesForProgram(string programCode, string programLevel);
        Task<IEnumerable<CourseResponseDTO>> GetUnassignedCoursesForProgram(string programCode, string programLevel);
    }
}
