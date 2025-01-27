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
                await CheckCourseExistence(courseDTO.Code);

                var course = mapper.Map<Course>(courseDTO);
                repositoryManager.CourseRepository.CreateRecord(course);
                await repositoryManager.SaveAsync();

                return new BaseResponse { Result = true, Message = "Course has been added" };
            }
            catch (Exception ex)
            {
                return new BaseResponse { Result = false, Message = ex.Message };
            }
        }

        public async Task<BaseResponse> DeleteCourse(string code)
        {
            try
            {
                var course = await repositoryManager.CourseRepository.FindByCodeAsync(code) 
                    ?? throw new NotFoundException($"The course with Code: {code} was not found!");

                repositoryManager.CourseRepository.DeleteRecord(course);
                await repositoryManager.SaveAsync();

                return new BaseResponse { Result = true, Message = " The course has been deleted" };
            }
            catch(Exception ex)
            {
                return new BaseResponse { Result = false, Message = ex.Message };
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
                if(code != courseDTO.Code)
                    await CheckCourseExistence(courseDTO.Code);

                var course = await repositoryManager.CourseRepository.FindByCodeAsync(code) 
                    ?? throw new NotFoundException($"The course with Code: {code} was not found!");

                mapper.Map(courseDTO, course);

                repositoryManager.CourseRepository.UpdateRecord(course);
                await repositoryManager.SaveAsync();

                return new BaseResponse { Result = true, Message = "The course has been modified" };
            }
            catch(Exception ex)
            {
                return new BaseResponse { Result = false, Message = ex.Message };
            }
        }

        private async Task CheckCourseExistence(string code)
        {
            var existingCourse = await repositoryManager.CourseRepository.FindByCodeAsync(code);
            if (existingCourse != null)
            {
                throw new BadRequestException($"The course with Code: {code} already exists");
            }
        }
    }
}
