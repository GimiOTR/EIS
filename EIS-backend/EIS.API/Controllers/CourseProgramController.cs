using EIS.Application.DTO.Request;
using EIS.Application.IService;
using Microsoft.AspNetCore.Mvc;


namespace EIS.API.Controllers
{
    [Route("api/course-programs")]
    [ApiController]
    public class CourseProgramController(IServiceManager serviceManager) : ControllerBase
    {
        [HttpGet("{code}/{level}")]
        public async Task<IActionResult> GetAll(string code, string level)
        {
            var result = await serviceManager.CourseProgramService.GetAllCoursesForProgram(code, level);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CourseProgramRequestDTO courseProgramRequestDTO)
        {
            var result = await serviceManager.CourseProgramService.AddCourseForProgram(courseProgramRequestDTO);
            return Ok(result);
        }

        [HttpPut()]
        public async Task<IActionResult> Put([FromBody] CourseProgramRequestDTO courseProgramRequestDTO)
        {
            var result = await serviceManager.CourseProgramService.UpdateCourseForProgram(courseProgramRequestDTO);
            return Ok(result);
        }

        [HttpDelete("{code}/{level}/{courseCode}")]
        public async Task<IActionResult> Delete(string code, string level, string courseCode)
        {
            var result = await serviceManager.CourseProgramService.RemoveCourseFromProgram(courseCode, code, level);
            return Ok(result);
        }

    }
}
