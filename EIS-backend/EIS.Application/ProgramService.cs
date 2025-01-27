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
    public class ProgramService(IRepositoryManager repositoryManager, IMapper mapper) : IProgramService
    {

        public async Task<BaseResponse> CreateProgram(ProgramRequestDTO programDTO)
        {
            try
            {
                await CheckProgramExistence(programDTO.Code, programDTO.Level);

                var program = mapper.Map<StudyProgram>(programDTO);
                repositoryManager.ProgramRepository.CreateRecord(program);
                await repositoryManager.SaveAsync();

                return new BaseResponse { Result = true, Message = "Program has been added" };
            }
            catch (Exception ex)
            {
                return new BaseResponse { Result = false, Message = ex.Message };
            }
        }

        public async Task<BaseResponse> DeleteProgram(string code, string level)
        {
            try
            {
                var program = await repositoryManager.ProgramRepository.FindByCodeAndLevelAsync(code,level) 
                    ?? throw new NotFoundException($"The program with Code: {code} and Level: {level} was not found!");

                repositoryManager.ProgramRepository.DeleteRecord(program);
                await repositoryManager.SaveAsync();

                return new BaseResponse { Result = true, Message = " The program has been deleted" };
            }
            catch (Exception ex)
            {
                return new BaseResponse { Result = false, Message = ex.Message };
            }
        }

        public async Task<ProgramResponseDTO> FindProgramById(int id)
        {
            try
            {
                var program = await repositoryManager.ProgramRepository.FindByIdAsync(id);
                return program == null
                    ? throw new NotFoundException($"The program with Id: {id} was not found!")
                    : mapper.Map<ProgramResponseDTO>(program);
            }
            catch (Exception ex)
            {
                throw new BadRequestException(ex.Message);
            }
        }

        public async Task<ProgramResponseDTO> FindProgramByCodeAndLevel(string code, string level)
        {
            try
            {
                var program = await repositoryManager.ProgramRepository.FindByCodeAndLevelAsync(code, level);
                return program == null
                    ? throw new NotFoundException($"The program with Code: {code} and Level: {level} was not found!")
                    : mapper.Map<ProgramResponseDTO>(program);
            }
            catch (Exception ex)
            {
                throw new BadRequestException(ex.Message);
            }
        }

        public async Task<IEnumerable<ProgramResponseDTO>> GetAllPrograms()
        {
            try
            {
                var programs = await repositoryManager.ProgramRepository.GetAllAsync();

                return mapper.Map<IEnumerable<ProgramResponseDTO>>(programs);
            }
            catch (Exception ex)
            {
                throw new BadRequestException(ex.Message);
            }

        }

        public async Task<BaseResponse> UpdateProgram(string code, string level, ProgramRequestDTO programDTO)
        {
            try
            {
                if (code != programDTO.Code || level != programDTO.Level)
                    await CheckProgramExistence(code, level);

                var existingProgram = await repositoryManager.ProgramRepository.FindByCodeAndLevelAsync(code, level) 
                    ?? throw new NotFoundException($"The program with Code: {code} and Level: {level} was not found!");

                mapper.Map(programDTO, existingProgram);

                repositoryManager.ProgramRepository.UpdateRecord(existingProgram);
                await repositoryManager.SaveAsync();

                return new BaseResponse { Result = true, Message = "The program has been modified" };
            }
            catch (Exception ex)
            {
                return new BaseResponse { Result = false, Message = ex.Message };
            }
        }

        private async Task CheckProgramExistence(string code, string level)
        {
            var existingProgram = await repositoryManager.ProgramRepository.FindByCodeAndLevelAsync(code, level);
            if (existingProgram != null)
            {
                throw new BadRequestException($"The program with Code: {code} and Level: {level} already exists!");
            }
        }
    }
}
