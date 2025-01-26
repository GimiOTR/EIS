using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EIS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveEntityCourseProgramYear : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CourseProgramLecturers");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CourseProgramLecturers",
                columns: table => new
                {
                    CourseId = table.Column<int>(type: "int", nullable: false),
                    ProgramId = table.Column<int>(type: "int", nullable: false),
                    AcademicYearId = table.Column<int>(type: "int", nullable: false),
                    MainLecturerId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    SecondLecturerId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    ClassAverage = table.Column<int>(type: "int", nullable: false),
                    NumberOfStudents = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CourseProgramLecturers", x => new { x.CourseId, x.ProgramId, x.AcademicYearId });
                    table.ForeignKey(
                        name: "FK_CourseProgramLecturers_AcademicYears_AcademicYearId",
                        column: x => x.AcademicYearId,
                        principalTable: "AcademicYears",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CourseProgramLecturers_AspNetUsers_MainLecturerId",
                        column: x => x.MainLecturerId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CourseProgramLecturers_AspNetUsers_SecondLecturerId",
                        column: x => x.SecondLecturerId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_CourseProgramLecturers_CoursePrograms_CourseId_ProgramId",
                        columns: x => new { x.CourseId, x.ProgramId },
                        principalTable: "CoursePrograms",
                        principalColumns: new[] { "CourseId", "ProgramId" },
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CourseProgramLecturers_AcademicYearId",
                table: "CourseProgramLecturers",
                column: "AcademicYearId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseProgramLecturers_MainLecturerId",
                table: "CourseProgramLecturers",
                column: "MainLecturerId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseProgramLecturers_SecondLecturerId",
                table: "CourseProgramLecturers",
                column: "SecondLecturerId");
        }
    }
}
