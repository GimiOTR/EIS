using AutoMapper;
using EIS.Application.DTO.Request;
using EIS.Application.DTO.Response;
using EIS.Application.Exceptions;
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
    public class AcademicYearService(IRepositoryManager repositoryManager, IMapper mapper) : IAcademicYearService
    {
        public async Task<BaseResponse> CreateAcademicYear()
        {
            try
            {
                var lastAcademicYear = await repositoryManager.AcademicYearRepository.FindLastAcademicYearAsync();
                if (!lastAcademicYear.SpringSemesterFinalized)
                {
                    throw new BadRequestException("Cannot create a new academic year without finalizing the spring semester of the previous academic year");
                }

                var academicYear = new AcademicYear
                { 
                    StartYear = lastAcademicYear.EndYear, 
                    EndYear = lastAcademicYear.EndYear + 1
                };
                repositoryManager.AcademicYearRepository.CreateRecord(academicYear);
                await repositoryManager.SaveAsync();

                return new BaseResponse
                {
                    Result = true,
                    Message = "academic year has been added"
                };
            }
            catch (Exception ex)
            {
                return new BaseResponse
                {
                    Result = false,
                    Message = ex.Message
                };
            }
        }

        public async Task<AcademicYearResponseDTO> FindAcademicYearByStartYear(int startYear)
        {
            try
            {
                var academicYear = await repositoryManager.AcademicYearRepository.FindByStartYearAsync(startYear);
                return academicYear == null
                    ? throw new NotFoundException($"The academic year with start year: {startYear} was not found!")
                    : mapper.Map<AcademicYearResponseDTO>(academicYear);
            }
            catch (Exception ex)
            {
                throw new BadRequestException(ex.Message);
            }
        }

        public async Task<IEnumerable<AcademicYearResponseDTO>> GetAllAcademicYears()
        {
            try
            {
                var academicYears = await repositoryManager.AcademicYearRepository.GetAllAsync();

                return mapper.Map<IEnumerable<AcademicYearResponseDTO>>(academicYears);
            }
            catch (Exception ex)
            {
                throw new BadRequestException(ex.Message);
            }

        }

        public async Task<BaseResponse> UpdateAcademicYear(int startYear, UpdateAcademicYearDTO academicYearDTO)
        {
            try
            {
                if(!academicYearDTO.FallSemesterFinalized && academicYearDTO.SpringSemesterFinalized)
                {
                    throw new BadRequestException("Cannot finalize spring semester without finalizing fall semester first");
                }

                var existingAcademicYear = await repositoryManager.AcademicYearRepository.FindByStartYearAsync(startYear) 
                    ?? throw new NotFoundException($"The academic year with start year: {startYear} was not found!");

                mapper.Map(academicYearDTO, existingAcademicYear);
                repositoryManager.AcademicYearRepository.UpdateRecord(existingAcademicYear);
                await repositoryManager.SaveAsync();

                return new BaseResponse
                {
                    Result = true,
                    Message = "The academic year has been modified"
                };
            }
            catch (Exception ex)
            {
                return new BaseResponse { Result = false, Message = ex.Message };
            }
        }
    }
}
