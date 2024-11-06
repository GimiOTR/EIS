using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EIS.Application.DTO.Request
{
    public class CreateAcademicYearDTO
    {
        public DateOnly StartYear { get; set; }
        public DateOnly EndYear { get; set; }
    }
}
