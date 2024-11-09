using EIS.Application.DTO.Request;
using EIS.Application.IService;
using Microsoft.AspNetCore.Mvc;


namespace EIS.API.Controllers
{
    [Route("api/course-programs")]
    [ApiController]
    public class CourseProgramController(IServiceManager serviceManager) : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CourseProgramRequestDTO courseProgramRequestDTO)
        {
            var result = await serviceManager.CourseProgramService.AddCourseForProgram(courseProgramRequestDTO);
            return Ok(result);
        }
    }
}
