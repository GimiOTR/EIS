using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EIS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAcademicYearConfiguration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AcademicYears",
                columns: new[] { "Id", "EndYear", "FallSemesterFinalized", "SpringSemesterFinalized", "StartYear" },
                values: new object[] { 1, 2025, false, false, 2024 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AcademicYears",
                keyColumn: "Id",
                keyValue: 1);
        }
    }
}
