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

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] ProgramRequestDTO programDTO)
        {
            var result = await serviceManager.ProgramService.UpdateProgram(id, programDTO);
            return Ok(result);
        }
        
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await serviceManager.ProgramService.DeleteProgram(id);
            return Ok(result);
        }
    }
}
