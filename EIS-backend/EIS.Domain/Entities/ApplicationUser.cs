using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EIS.Domain.Entities
{
    public class ApplicationUser : IdentityUser
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public string EpokaId { get; set; }
        public DateOnly BirthDay { get; set; }
        public string BirthPlace { get; set; }
        public string Gender { get; set; }
        public string Citizenship { get; set; }
        public string IdCardNumber { get; set; }
    }
}