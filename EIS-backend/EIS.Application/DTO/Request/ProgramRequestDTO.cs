using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EIS.Application.DTO.Request
{
    public class ProgramRequestDTO
    {
        public string Name { get; set; }
        public string Code { get; set; }
        public string Level { get; set; }
        public int DurationInSemesters { get; set; }    
    }
}
