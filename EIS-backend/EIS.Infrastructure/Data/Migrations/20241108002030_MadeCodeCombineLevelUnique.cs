using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EIS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class MadeCodeCombineLevelUnique : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Programs_Code",
                table: "Programs");

            migrationBuilder.AlterColumn<string>(
                name: "Level",
                table: "Programs",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_Programs_Code_Level",
                table: "Programs",
                columns: new[] { "Code", "Level" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Programs_Code_Level",
                table: "Programs");

            migrationBuilder.AlterColumn<string>(
                name: "Level",
                table: "Programs",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.CreateIndex(
                name: "IX_Programs_Code",
                table: "Programs",
                column: "Code",
                unique: true);
        }
    }
}
