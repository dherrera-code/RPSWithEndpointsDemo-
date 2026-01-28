using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Service
{
    public class CpuChoiceService
    {
        public string RandomCpuChoice()
        {
            int num = Random.Shared.Next(0,3);
            string[] choice = ["rock", "paper", "scissors"];
            return choice[num];
        }
    }
}