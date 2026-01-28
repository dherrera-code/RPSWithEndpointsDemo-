using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using API.Service;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CpuChoiceController : ControllerBase
    {
        private readonly CpuChoiceService _choice;
        public CpuChoiceController (CpuChoiceService choice)
        {
            _choice = choice;
        }

        public string RandomCpuChoice()
        {
            return _choice.RandomCpuChoice();
        }
    }
}