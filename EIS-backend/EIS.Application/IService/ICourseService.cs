using EIS.Application.DTO.Request;
using EIS.Application.DTO.Response;
using EIS.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EIS.Application.IService
{
    public interface ICourseService
    {
        Task<IEnumerable<CourseResponseDTO>> GetAllCourses();
        Task<CourseResponseDTO> FindCourseById(int id);
        Task<CourseResponseDTO> FindCourseByCode(string code);
        Task<BaseResponse> CreateCourse(CourseRequestDTO courseDTO);
        Task<BaseResponse> DeleteCourse(string code);
        Task<BaseResponse> UpdateCourse(string code, CourseRequestDTO courseDTO);
    }
}
