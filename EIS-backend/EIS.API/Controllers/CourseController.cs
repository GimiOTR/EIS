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
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                var result = await serviceManager.CourseService.FindCourseById(id);
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

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] CourseRequestDTO courseDTO)
        {
            var result = await serviceManager.CourseService.UpdateCourse(id, courseDTO);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await serviceManager.CourseService.DeleteCourse(id);
            return Ok(result);
        }
    }
}
