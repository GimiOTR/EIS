using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EIS.Domain.Entities
{
    public class CourseProgramYear
    {
        [Key, Column(Order = 0)]
        public int CourseId { get; set; }

        [Key, Column(Order = 1)]
        public int ProgramId { get; set; }

        [Key, Column(Order = 2)]
        public int AcademicYearId { get; set; }
   
        public string MainLecturerId { get; set; }
        public string? SecondLecturerId { get; set; }
        public int NumberOfStudents { get; set; }
        public int ClassAverage { get; set; }

        [ForeignKey("CourseId, ProgramId")]
        public CourseProgram CourseProgram { get; set; }

        [ForeignKey("AcademicYearId")]
        public AcademicYear AcademicYear { get; set; }

        [ForeignKey("MainLecturerId")]
        public ApplicationUser MainLecturer { get; set; }

        [ForeignKey("SecondLecturerId")]
        public ApplicationUser? SecondLecturer { get; set; }
    }
}
