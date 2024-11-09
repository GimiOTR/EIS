using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EIS.Application.DTO.Request
{
    public class CourseProgramRequestDTO
    {
        public string CourseCode { get; set; }
        public string ProgramCode { get; set; }
        public string ProgramLevel { get; set; }

        public int Credits { get; set; }
        public int ECTS { get; set; }
        public int Semester { get; set; }
        public string Type { get; set; }
    }
}
