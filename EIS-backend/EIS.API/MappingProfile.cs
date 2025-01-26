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
            CreateMap<AcademicYear, UpdateAcademicYearDTO>().ReverseMap();
            CreateMap<AcademicYearResponseDTO, AcademicYear>().ReverseMap();

            //Course Program
            CreateMap<CourseProgram, CourseProgramRequestDTO>().ReverseMap();
            CreateMap<CourseProgram, CourseProgramResponseDTO>()
            .ForMember(dest => dest.CourseCode, opt => opt.MapFrom(src => src.Course.Code))
            .ForMember(dest => dest.CourseName, opt => opt.MapFrom(src => src.Course.Name));
        }
    }
}
