using EIS.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EIS.Domain.IRepository
{
    public interface ICourseProgramRepository
    {
        Task<CourseProgram> FindByIdAsync(int courseId, int programId);
        Task<IEnumerable<CourseProgram>> GetAllByProgramIdAsync(int id);
        void CreateRecord(CourseProgram courseProgram);
        void DeleteRecord(CourseProgram courseProgram);
        void UpdateRecord(CourseProgram courseProgram);
    }
}
