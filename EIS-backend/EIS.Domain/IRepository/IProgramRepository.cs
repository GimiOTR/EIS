using EIS.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EIS.Domain.IRepository
{
    public interface IProgramRepository
    {
        Task<IEnumerable<StudyProgram>> GetAllAsync();
        Task<StudyProgram> FindByIdAsync(int id);
        Task<StudyProgram> FindByCodeAndLevelAsync(string code, string level);
        void CreateRecord(StudyProgram course);
        void UpdateRecord(StudyProgram course);
        void DeleteRecord(StudyProgram course);
    }
}
