﻿using AutoMapper;
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
                var program = mapper.Map<StudyProgram>(programDTO);
                repositoryManager.ProgramRepository.CreateRecord(program);
                await repositoryManager.SaveAsync();

                return new BaseResponse
                {
                    Result = true,
                    Message = "Program has been added"
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

        public async Task<BaseResponse> DeleteProgram(int id)
        {
            try
            {
                var program = await repositoryManager.ProgramRepository.FindByIdAsync(id);
                if (program == null)
                {
                    return new BaseResponse { Result = false, Message = "The program with Id: " + id + " was not found" };
                }

                repositoryManager.ProgramRepository.DeleteRecord(program);
                return new BaseResponse
                {
                    Result = true,
                    Message = " The program has been deleted"
                };
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

        public async Task<IEnumerable<ProgramResponseDTO>> GetAllPrograms()
        {
            try
            {
                var programs = await repositoryManager.CourseRepository.GetAllAsync();

                return mapper.Map<IEnumerable<ProgramResponseDTO>>(programs);
            }
            catch (Exception ex)
            {
                throw new BadRequestException(ex.Message);
            }

        }

        public async Task<BaseResponse> UpdateProgram(int id, ProgramRequestDTO courseDTO)
        {
            try
            {
                var existingCourse = await repositoryManager.CourseRepository.FindByIdAsync(id);
                if (existingCourse == null)
                {
                    return new BaseResponse { Result = false, Message = "The device with Id: " + id + " was not found" };
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
            catch (Exception ex)
            {
                return new BaseResponse { Result = false, Message = ex.Message };
            }
        }
    }
}