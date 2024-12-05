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
    public class CourseService(IRepositoryManager repositoryManager, IMapper mapper) : ICourseService
    {
        public async Task<BaseResponse> CreateCourse(CourseRequestDTO courseDTO)
        {
            try
            {
                var course = mapper.Map<Course>(courseDTO);
                repositoryManager.CourseRepository.CreateRecord(course);
                await repositoryManager.SaveAsync();

                return new BaseResponse
                {
                    Result = true,  Message = "Course has been added"
                };
            }
            catch (Exception ex)
            {
                return new BaseResponse
                {
                    Result = false, Message = ex.Message
                };
            }
        }

        public async Task<BaseResponse> DeleteCourse(string code)
        {
            try
            {
                var course = await repositoryManager.CourseRepository.FindByCodeAsync(code);
                if (course == null) 
                {
                    return new BaseResponse {  Result = false,  Message = "The course with Id: " + code + " was not found"};
                }

                repositoryManager.CourseRepository.DeleteRecord(course);
                await repositoryManager.SaveAsync();

                return new BaseResponse
                {
                    Result = true, Message = " The course has been deleted"
                };
            }
            catch(Exception ex)
            {
                return new BaseResponse { Result = false, Message = ex.Message };
            }
        }

        public async Task<CourseResponseDTO> FindCourseById(int id)
        {
            try
            {
                var course = await repositoryManager.CourseRepository.FindByIdAsync(id);
                return course == null
                    ? throw new NotFoundException($"The course with Id: {id} was not found!")
                    : mapper.Map<CourseResponseDTO>(course);
            }
            catch (Exception ex)
            {
                throw new BadRequestException(ex.Message);
            }
        }

        public async Task<CourseResponseDTO> FindCourseByCode(string code)
        {
            try
            {
                var course = await repositoryManager.CourseRepository.FindByCodeAsync(code);
                return course == null
                    ? throw new NotFoundException($"The course with Code: {code} was not found!")
                    : mapper.Map<CourseResponseDTO>(course);
            }
            catch (Exception ex)
            {
                throw new BadRequestException(ex.Message);
            }
        }

        public async Task<IEnumerable<CourseResponseDTO>> GetAllCourses()
        {
            try
            {
                var courses = await repositoryManager.CourseRepository.GetAllAsync();

                return mapper.Map<IEnumerable<CourseResponseDTO>>(courses);
            }
            catch (Exception ex)
            {
                throw new BadRequestException(ex.Message);
            }

        }

        public async Task<BaseResponse> UpdateCourse(string code, CourseRequestDTO courseDTO)
        {
            try
            {
                var existingCourse = await repositoryManager.CourseRepository.FindByCodeAsync(code);
                if(existingCourse == null)
                {
                    return new BaseResponse { Result = false, Message = "The course with Id: " + code + " was not found" };
                }

                mapper.Map(courseDTO, existingCourse);

                repositoryManager.CourseRepository.UpdateRecord(existingCourse);
                await repositoryManager.SaveAsync();

                return new BaseResponse
                {
                    Result = true,
                    Message = "The course has been modified"
                };
            }
            catch(Exception ex)
            {
                return new BaseResponse { Result = false, Message = ex.Message };
            }
        }
    }
}
