using EIS.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EIS.Application.DTO.Response
{
    public class CourseProgramResponseDTO
    {
        public string CourseCode { get; set; }
        public string CourseName { get; set; }

        public int Credits { get; set; }
        public int ECTS { get; set; }
        public int Semester { get; set; }
        public string Type { get; set; }
    }
}
