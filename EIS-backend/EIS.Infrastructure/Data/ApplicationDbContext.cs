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
        public DbSet<CourseProgramYear> CourseProgramLecturers { get; set; }
        public DbSet<AcademicYear> AcademicYears { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Course>()
                .HasIndex(c => c.Code)
                .IsUnique();

            builder.Entity<CourseProgram>()
                .HasKey(cp => new { cp.CourseId, cp.ProgramId });

            builder.Entity<CourseProgram>()
                .HasOne(cp => cp.Course)
                .WithMany(c => c.CoursePrograms)
                .HasForeignKey(cp => cp.CourseId);

            builder.Entity<CourseProgram>()
                .HasOne(cp => cp.Program)
                .WithMany(p => p.CoursePrograms)
                .HasForeignKey(cp => cp.ProgramId);

            builder.Entity<CourseProgramYear>()
                .HasKey(cpy => new { cpy.CourseId, cpy.ProgramId, cpy.AcademicYearId });

            builder.Entity<CourseProgramYear>()
                .HasOne(cpy => cpy.CourseProgram)
                .WithMany(cp => cp.CourseProgramYears)
                .HasForeignKey(cpy => new { cpy.CourseId, cpy.ProgramId });

            builder.Entity<CourseProgramYear>()
                .HasOne(cpy => cpy.AcademicYear)
                .WithMany(ay => ay.CourseProgramYears)
                .HasForeignKey(cpy => cpy.AcademicYearId);
        }
    }
}
