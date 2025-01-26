using EIS.Application.DTO.Request;
using EIS.Application.Exceptions;
using EIS.Application.IService;
using Microsoft.AspNetCore.Mvc;

namespace EIS.API.Controllers
{
    [Route("api/years")]
    [ApiController]
    public class AcademicYearController(IServiceManager serviceManager) : ControllerBase
    {
        [HttpGet("{startYear}")]
        public async Task<IActionResult> Get(int startYear)
        {
            try
            {
                var result = await serviceManager.AcademicYearService.FindAcademicYearByStartYear(startYear);
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
            var result = await serviceManager.AcademicYearService.GetAllAcademicYears();
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Post()
        {
            var result = await serviceManager.AcademicYearService.CreateAcademicYear();
            return Ok(result);
        }

        [HttpPut("{startYear}")]
        public async Task<IActionResult> Put(int startYear, [FromBody] UpdateAcademicYearDTO academicYearDTO)
        {
            var result = await serviceManager.AcademicYearService.UpdateAcademicYear(startYear, academicYearDTO);
            return Ok(result);
        }
    }
}
