using EIS.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EIS.Infrastructure.Data.Configurations
{
    public class AcademicYearConfiguration : IEntityTypeConfiguration<AcademicYear>
    {
        public void Configure(EntityTypeBuilder<AcademicYear> builder)
        {
            builder.HasData(
                new AcademicYear
                {
                    Id = 1,
                    StartYear = 2024,
                    EndYear = 2025,
                    FallSemesterFinalized = false,
                    SpringSemesterFinalized = false
                }
            );
        }
    }
}
