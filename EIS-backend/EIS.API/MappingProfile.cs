using AutoMapper;
using EIS.Application.DTO.Request;
using EIS.Application.DTO.Response;
using EIS.Domain.Entities;

namespace EIS.API
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            //Course
            CreateMap<Course,CourseRequestDTO>().ReverseMap();
            CreateMap<CourseResponseDTO,Course>().ReverseMap();

            //Program
            CreateMap<StudyProgram, ProgramRequestDTO>().ReverseMap();
            CreateMap<ProgramResponseDTO, StudyProgram>().ReverseMap();

            //Academic Year
            CreateMap<AcademicYear, CreateAcademicYearDTO>().ReverseMap();
            CreateMap<AcademicYear, UpdateAcademicYearDTO>().ReverseMap();
            CreateMap<AcademicYearResponseDTO, AcademicYear>().ReverseMap();
        }
    }
}
