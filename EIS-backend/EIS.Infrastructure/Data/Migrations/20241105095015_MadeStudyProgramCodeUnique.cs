using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EIS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class MadeStudyProgramCodeUnique : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Duration",
                table: "Programs",
                newName: "DurationInSemesters");

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "Programs",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_Programs_Code",
                table: "Programs",
                column: "Code",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Programs_Code",
                table: "Programs");

            migrationBuilder.RenameColumn(
                name: "DurationInSemesters",
                table: "Programs",
                newName: "Duration");

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "Programs",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");
        }
    }
}
