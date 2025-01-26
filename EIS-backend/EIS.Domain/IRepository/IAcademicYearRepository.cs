using EIS.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EIS.Domain.IRepository
{
    public interface IAcademicYearRepository
    {
        Task<IEnumerable<AcademicYear>> GetAllAsync();
        Task<AcademicYear> FindByIdAsync(int id);
        Task<AcademicYear> FindByStartYearAsync(int startYear);
        Task<AcademicYear> FindLastAcademicYearAsync();
        void CreateRecord(AcademicYear academicYear);
        void UpdateRecord(AcademicYear academicYear);
    }
}
