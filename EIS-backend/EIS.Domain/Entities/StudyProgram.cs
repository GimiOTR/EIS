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

        private string _level;
        public string Level
        {
            get => _level;
            set
            {
                _level = value;
                DurationInSemesters = value switch
                {
                    "BA" => 6,
                    "MSc" => 4,
                    _ => 0 // Default value if Level is not recognized
                };
            }
        }

        public int DurationInSemesters { get; private set; }

        public ICollection<CourseProgram> CoursePrograms { get; set; }
    }
}
