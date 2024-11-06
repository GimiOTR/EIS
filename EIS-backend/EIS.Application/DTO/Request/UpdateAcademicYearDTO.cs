using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EIS.Application.DTO.Request
{
    public class UpdateAcademicYearDTO
    {
        public bool FallSemesterFinalized { get; set; }
        public bool SpringSemesterFinalized { get; set; } 
    }
}
