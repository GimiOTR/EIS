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
        public async Task<BaseResponse> CreateAcademicYear(CreateAcademicYearDTO academicYearDTO)
        {
            try
            {
                var academicYear = mapper.Map<AcademicYear>(academicYearDTO);
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

        public async Task<AcademicYearResponseDTO> FindAcademicYearById(int id)
        {
            try
            {
                var academicYear = await repositoryManager.AcademicYearRepository.FindByIdAsync(id);
                return academicYear == null
                    ? throw new NotFoundException($"The academic year with Id: {id} was not found!")
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

        public async Task<BaseResponse> UpdateAcademicYear(int id, UpdateAcademicYearDTO academicYearDTO)
        {
            try
            {
                var existingAcademicYear = await repositoryManager.AcademicYearRepository.FindByIdAsync(id);
                if (existingAcademicYear == null)
                {
                    return new BaseResponse { Result = false, Message = "The academic year with Id: " + id + " was not found" };
                }

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
