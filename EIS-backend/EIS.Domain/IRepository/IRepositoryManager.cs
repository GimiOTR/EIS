﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EIS.Domain.IRepository
{
    public interface IRepositoryManager
    {
        ICourseRepository CourseRepository { get; }
        IProgramRepository ProgramRepository { get; }

        Task SaveAsync();
    }
}