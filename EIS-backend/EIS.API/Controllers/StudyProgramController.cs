using EIS.Application.DTO.Request;
using EIS.Application.Exceptions;
using EIS.Application.IService;
using Microsoft.AspNetCore.Mvc;

namespace EIS.API.Controllers
{
    [Route("api/programs")]
    [ApiController]
    public class StudyProgramController(IServiceManager serviceManager) : ControllerBase
    {
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                var result = await serviceManager.ProgramService.FindProgramById(id);
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
            var result = await serviceManager.ProgramService.GetAllPrograms();
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ProgramRequestDTO programDTO)
        {
            var result = await serviceManager.ProgramService.CreateProgram(programDTO);
            return Ok(result);
        }

        [HttpPut("{code}/{level}")]
        public async Task<IActionResult> Put(string code, string level, [FromBody] ProgramRequestDTO programDTO)
        {
            var result = await serviceManager.ProgramService.UpdateProgram(code, level, programDTO);
            return Ok(result);
        }
        
        [HttpDelete("{code}/{level}")]
        public async Task<IActionResult> Delete(string code, string level)
        {
            var result = await serviceManager.ProgramService.DeleteProgram(code, level);
            return Ok(result);
        }
    }
}
