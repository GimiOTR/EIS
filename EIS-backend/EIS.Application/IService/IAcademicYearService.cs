using EIS.Application.DTO.Request;
using EIS.Application.DTO.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EIS.Application.IService
{
    public interface IAcademicYearService
    {
        Task<IEnumerable<AcademicYearResponseDTO>> GetAllAcademicYears();
        Task<AcademicYearResponseDTO> FindAcademicYearByStartYear(int startYear);
        Task<BaseResponse> CreateAcademicYear(CreateAcademicYearDTO academicYearDTO);
        Task<BaseResponse> UpdateAcademicYear(int id, UpdateAcademicYearDTO academicYearDTO);
    }
}
