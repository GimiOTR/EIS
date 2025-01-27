using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EIS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDefaultUserConfiguration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "6a4e3684-884a-4d18-9665-6cf4f38ef332", 0, "6aad02c1-def4-496c-87c0-c020d245a38d", "admin@epoka.edu.al", true, false, null, "ADMIN@EPOKA.EDU.AL", "ADMIN@EPOKA.EDU.AL", "AQAAAAIAAYagAAAAEKgE4mGlLMqQXp5XsvWN56PUNFp87gh1YfXjeDDIzhmA0CrfHwhtWJWryTjkjFnU2Q==", null, false, "098DAEF11E16DA448EB47195C8049093", false, "admin@epoka.edu.al" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "6a4e3684-884a-4d18-9665-6cf4f38ef332");
        }
    }
}
