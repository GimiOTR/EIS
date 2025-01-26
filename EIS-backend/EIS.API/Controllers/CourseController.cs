using EIS.Application.DTO.Request;
using EIS.Application.Exceptions;
using EIS.Application.IService;
using EIS.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace EIS.API.Controllers
{
    [Route("api/courses")]
    [ApiController]
    public class CourseController(IServiceManager serviceManager) : ControllerBase
    {
        [HttpGet("{code}")]
        public async Task<IActionResult> Get(string code)
        {
            try
            {
                var result = await serviceManager.CourseService.FindCourseByCode(code);
                return Ok(result);
            }
            catch (BadRequestException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await serviceManager.CourseService.GetAllCourses();
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CourseRequestDTO courseDTO)
        {
            var result = await serviceManager.CourseService.CreateCourse(courseDTO);
            return Ok(result);
        }

        [HttpPut("{code}")]
        public async Task<IActionResult> Put(string code, [FromBody] CourseRequestDTO courseDTO)
        {
            var result = await serviceManager.CourseService.UpdateCourse(code, courseDTO);
            return Ok(result);
        }

        [HttpDelete("{code}")]
        public async Task<IActionResult> Delete(string code)
        {
            var result = await serviceManager.CourseService.DeleteCourse(code);
            return Ok(result);
        }
    }
}
