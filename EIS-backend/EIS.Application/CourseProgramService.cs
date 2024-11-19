using EIS.Application.DTO.Request;
using EIS.Application.IService;
using EIS.Domain.Entities;
using EIS.Domain.IRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using EIS.Application.DTO.Response;
using EIS.Application.Exceptions;

namespace EIS.Application
{
    public class CourseProgramService(IRepositoryManager repositoryManager, IMapper mapper) : ICourseProgramService
    {
        public async Task<BaseResponse> AddCourseForProgram(CourseProgramRequestDTO courseProgramRequestDTO)
        {
            try
            {
                var (errorResponse, course, program) = await GetCourseAndProgram(courseProgramRequestDTO);
                if (errorResponse != null)
                {
                    return errorResponse;
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

                return new BaseResponse { Result = true, Message = "Course has been added to the program" };
            }
            catch (Exception ex)
            {
                return new BaseResponse { Result = false, Message = ex.Message };
            }
        }

        public async Task<IEnumerable<CourseProgramResponseDTO>> GetAllCoursesForProgram(string programCode, string programLevel)
        {
            var program = await repositoryManager.ProgramRepository.FindByCodeAndLevelAsync(programCode, programLevel)
                ?? throw new NotFoundException("Program not found");

            var coursePrograms = await repositoryManager.CourseProgramRepository.GetAllByProgramIdAsync(program.Id);

            var courseProgramDTOs = mapper.Map<IEnumerable<CourseProgramResponseDTO>>(coursePrograms);

            return courseProgramDTOs;
        }

        public async Task<BaseResponse> RemoveCourseFromProgram(string courseCode, string programCode, string programLevel)
        {
            try
            {
                var courseProgramRequestDTO = new CourseProgramRequestDTO
                {
                    CourseCode = courseCode,
                    ProgramCode = programCode,
                    ProgramLevel = programLevel
                };

                var (errorResponse, course, program) = await GetCourseAndProgram(courseProgramRequestDTO);
                if (errorResponse != null)
                {
                    return errorResponse;
                }

                var courseProgram = await repositoryManager.CourseProgramRepository.FindByIdAsync(course.Id, program.Id);
                if (courseProgram == null)
                {
                    return new BaseResponse { Result = false, Message = "This course is not part of this program" };
                }

                repositoryManager.CourseProgramRepository.DeleteRecord(courseProgram);
                await repositoryManager.SaveAsync();

                return new BaseResponse { Result = true, Message = "Course has been removed from the program" };
            }
            catch (Exception ex)
            {
                return new BaseResponse { Result = false, Message = ex.Message };
            }
        }

        public async Task<BaseResponse> UpdateCourseForProgram(CourseProgramRequestDTO courseProgramRequestDTO)
        {
            try
            {
                var (errorResponse, course, program) = await GetCourseAndProgram(courseProgramRequestDTO);
                if (errorResponse != null)
                {
                    return errorResponse;
                }

                var existingCourseProgram = await repositoryManager.CourseProgramRepository.FindByIdAsync(course.Id, program.Id);
                if (existingCourseProgram == null)
                {
                    return new BaseResponse { Result = false, Message = "Course is not part of this program" };
                }

                mapper.Map(courseProgramRequestDTO, existingCourseProgram);
                repositoryManager.CourseProgramRepository.UpdateRecord(existingCourseProgram);
                await repositoryManager.SaveAsync();

                return new BaseResponse { Result = true, Message = "Course has been updated for the program" };
            }
            catch (Exception ex)
            {
                return new BaseResponse { Result = false, Message = ex.Message };
            }
        }

        private async Task<(BaseResponse? errorResponse, Course? course, StudyProgram? program)> GetCourseAndProgram(CourseProgramRequestDTO dto)
        {
            var course = await repositoryManager.CourseRepository.FindByCodeAsync(dto.CourseCode);
            var program = await repositoryManager.ProgramRepository.FindByCodeAndLevelAsync(dto.ProgramCode, dto.ProgramLevel);

            if (course == null || program == null)
            {
                return (new BaseResponse { Result = false, Message = "Course or Program not found" }, null, null);
            }

            return (null, course, program);
        }
    }
}
