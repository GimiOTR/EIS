using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EIS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ModifiedAcademicYear : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "FallSemesterFinalized",
                table: "AcademicYears",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "SpringSemesterFinalized",
                table: "AcademicYears",
                type: "bit",
                nullable: false,
                defaultValue: false);

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AcademicYears_EndYear",
                table: "AcademicYears");

            migrationBuilder.DropIndex(
                name: "IX_AcademicYears_StartYear",
                table: "AcademicYears");

            migrationBuilder.DropColumn(
                name: "FallSemesterFinalized",
                table: "AcademicYears");

            migrationBuilder.DropColumn(
                name: "SpringSemesterFinalized",
                table: "AcademicYears");
        }
    }
}
