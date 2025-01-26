using EIS.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace EIS.Infrastructure.Data
{
    public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : IdentityDbContext<ApplicationUser>(options)
    {
        public DbSet<Course> Courses { get; set; }
        public DbSet<StudyProgram> Programs { get; set; }
        public DbSet<CourseProgram> CoursePrograms { get; set; }
        public DbSet<AcademicYear> AcademicYears { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.ApplyConfiguration(new AcademicYearConfiguration());

            builder.Entity<Course>(entity =>
            {
                entity.HasIndex(c => c.Code).IsUnique();
                entity.HasIndex(c => c.Name).IsUnique();
            });

            builder.Entity<StudyProgram>()
                .HasIndex(p => new { p.Code, p.Level })
                .IsUnique();

            builder.Entity<AcademicYear>(entity =>
            {
                entity.HasIndex(ay => ay.StartYear).IsUnique();
                entity.HasIndex(ay => ay.EndYear).IsUnique();
            });

            builder.Entity<CourseProgram>(entity =>
            {
                entity.HasKey(cp => new { cp.CourseId, cp.ProgramId });

                entity.HasOne(cp => cp.Course)
                    .WithMany(c => c.CoursePrograms)
                    .HasForeignKey(cp => cp.CourseId);

                entity.HasOne(cp => cp.Program)
                    .WithMany(p => p.CoursePrograms)
                    .HasForeignKey(cp => cp.ProgramId);
            });
        }
    }
}
