using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EIS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveYearIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AcademicYears_EndYear",
                table: "AcademicYears");

            migrationBuilder.DropIndex(
                name: "IX_AcademicYears_StartYear",
                table: "AcademicYears");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_AcademicYears_EndYear",
                table: "AcademicYears",
                column: "EndYear",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AcademicYears_StartYear",
                table: "AcademicYears",
                column: "StartYear",
                unique: true);
        }
    }
}
