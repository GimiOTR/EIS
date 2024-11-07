using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EIS.Domain.Entities
{
    public class AcademicYear
    {
        [Key]
        public int Id { get; set; }
        public int StartYear { get; set; }
        public int EndYear { get; set; }
        public bool FallSemesterFinalized { get; set; } = false;
        public bool SpringSemesterFinalized { get; set; } = false;

        public ICollection<CourseProgramYear> CourseProgramYears { get; set; }
    }
}
