using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EIS.Domain.Entities
{
    public class StudyProgram
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public string Level { get; set; }
        public int Duration { get; set; }

        public ICollection<CourseProgram> CoursePrograms { get; set; }
    }
}
