using EIS.Domain.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace EIS.Infrastructure.Data.Configurations
{
    public class ApplicationUserConfiguration : IEntityTypeConfiguration<ApplicationUser>
    {
        public void Configure(EntityTypeBuilder<ApplicationUser> builder)
        {
            var hasher = new PasswordHasher<ApplicationUser>();

            var user = new ApplicationUser
            {
                Id = "6a4e3684-884a-4d18-9665-6cf4f38ef332",
                UserName = "admin@epoka.edu.al",
                NormalizedUserName = "ADMIN@EPOKA.EDU.AL",
                Email = "admin@epoka.edu.al",
                NormalizedEmail = "ADMIN@EPOKA.EDU.AL",
                EmailConfirmed = true,
                SecurityStamp = GenerateSecurityStamp(),
                ConcurrencyStamp = Guid.NewGuid().ToString("D"),
                PhoneNumberConfirmed = false,
                TwoFactorEnabled = false,
                LockoutEnabled = false,
                AccessFailedCount = 0
            };

            user.PasswordHash = hasher.HashPassword(user, "Admin1@");

            builder.HasData(user);
        }

        private readonly Func<string> GenerateSecurityStamp = delegate ()
        {
            var guid = Guid.NewGuid();
            return String.Concat(Array.ConvertAll(guid.ToByteArray(), b => b.ToString("X2")));
        };
    }
}
