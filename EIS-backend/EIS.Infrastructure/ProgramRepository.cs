using EIS.Domain.Entities;
using EIS.Domain.IRepository;
using EIS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EIS.Infrastructure
{
    public class ProgramRepository(ApplicationDbContext repositoryContext) : RepositoryBase<StudyProgram>(repositoryContext),IProgramRepository
    {
        public void CreateRecord(StudyProgram program) => Create(program);

        public void DeleteRecord(StudyProgram program) => Delete(program);

        public async Task<StudyProgram> FindByIdAsync(int id) => await FindByCondition(c => c.Id.Equals(id)).FirstOrDefaultAsync();

        public async Task<StudyProgram> FindByCodeAndLevelAsync(string code, string level) => 
            await FindByCondition(c => c.Code.Equals(code) && c.Level.Equals(level))
            .FirstOrDefaultAsync();

        public async Task<IEnumerable<StudyProgram>> GetAllAsync() => await FindAll().ToListAsync();

        public void UpdateRecord(StudyProgram program) => Update(program);
    }
}
