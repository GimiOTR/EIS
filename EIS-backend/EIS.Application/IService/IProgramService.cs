using EIS.Application.DTO.Request;
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
        Task<BaseResponse> CreateProgram(ProgramRequestDTO programDTO);
        Task<BaseResponse> DeleteProgram(int id);
        Task<BaseResponse> UpdateProgram(int id, ProgramRequestDTO programDTO);
    }
}
