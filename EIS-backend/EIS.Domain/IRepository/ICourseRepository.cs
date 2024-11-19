using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EIS.Domain.Entities;

namespace EIS.Domain.IRepository
{
    public interface ICourseRepository
    {
        Task<IEnumerable<Course>> GetAllAsync();
        Task<Course> FindByIdAsync(int id);
        Task<Course> FindByCodeAsync(string code);
        void CreateRecord(Course course);
        void UpdateRecord(Course course);
        void DeleteRecord(Course course);
    }
}
