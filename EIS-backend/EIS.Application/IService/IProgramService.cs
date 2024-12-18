﻿using EIS.Application.DTO.Request;
using EIS.Application.DTO.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EIS.Application.IService
{
    public interface IProgramService
    {
        Task<IEnumerable<ProgramResponseDTO>> GetAllPrograms();
        Task<ProgramResponseDTO> FindProgramById(int id);
        Task<ProgramResponseDTO> FindProgramByCodeAndLevel(string code, string level);
        Task<BaseResponse> CreateProgram(ProgramRequestDTO programDTO);
        Task<BaseResponse> DeleteProgram(string code, string level);
        Task<BaseResponse> UpdateProgram(string code, string level, ProgramRequestDTO programDTO);
    }
}
