using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace bank.Models
{
    public class m_manage
    {
        public int bank_id { get; set; }
        public string actiontype { get; set; }
        public decimal amt { get; set; }
        public int to_bank_id { get; set; }
    }
}
