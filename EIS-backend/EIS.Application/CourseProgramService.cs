using EIS.Application.DTO.Request;
using EIS.Application.IService;
using EIS.Domain.Entities;
using EIS.Domain.IRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EIS.Application
{
    public class CourseProgramService(IRepositoryManager repositoryManager) : ICourseProgramService
    {
        public async Task<BaseResponse> AddCourseForProgram(CourseProgramRequestDTO courseProgramRequestDTO)
        {
            try
            {
                var course = await repositoryManager.CourseRepository.FindByCodeAsync(courseProgramRequestDTO.CourseCode);
                var program = await repositoryManager.ProgramRepository.FindByCodeAndLevelAsync(courseProgramRequestDTO.ProgramCode, courseProgramRequestDTO.ProgramLevel);

                if (course == null || program == null)
                {
                    return new BaseResponse { Result = false, Message = "Course or Program not found" };
                }

                var courseProgram = new CourseProgram
                {
                    CourseId = course.Id,
                    ProgramId = program.Id,
                    Credits = courseProgramRequestDTO.Credits,
                    ECTS = courseProgramRequestDTO.ECTS,
                    Semester = courseProgramRequestDTO.Semester,
                    Type = courseProgramRequestDTO.Type
                };
                repositoryManager.CourseProgramRepository.CreateRecord(courseProgram);
                await repositoryManager.SaveAsync();

                return new BaseResponse {Result = true, Message = "Course has been added to the program"};
            }
            catch (Exception ex)
            {
                return new BaseResponse { Result = false, Message = ex.Message };
            }
        }
    }
}
