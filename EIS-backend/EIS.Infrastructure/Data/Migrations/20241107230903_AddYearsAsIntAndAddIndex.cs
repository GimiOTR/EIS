using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EIS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddYearsAsIntAndAddIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "EndYear",
                table: "AcademicYears",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "StartYear",
                table: "AcademicYears",
                type: "int",
                nullable: false,
                defaultValue: 0);

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
                name: "EndYear",
                table: "AcademicYears");

            migrationBuilder.DropColumn(
                name: "StartYear",
                table: "AcademicYears");
        }
    }
}
