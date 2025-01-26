using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EIS.Domain.Entities
{
    public class CourseProgram
    {
        [Key, Column(Order = 0)]
        public int CourseId { get; set; }

        [Key, Column(Order = 1)]
        public int ProgramId { get; set; }

        public int Credits { get; set; }
        public int ECTS { get; set; }
        public int Semester { get; set; }
        public string Type { get; set; }

        [ForeignKey("CourseId")]
        public Course Course { get; set; }

        [ForeignKey("ProgramId")]
        public StudyProgram Program { get; set; }
    }
}
