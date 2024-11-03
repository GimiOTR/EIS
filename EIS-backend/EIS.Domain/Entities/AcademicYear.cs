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
        public DateOnly StartYear { get; set; }
        public DateOnly EndYear { get; set; }

        public ICollection<CourseProgramYear> CourseProgramYears { get; set; }
    }
}
