using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace bank.Models
{
    public class SaveAccountData
    {
        public string iban_no { get; set; }
        public string fullname { get; set; }
        public bool is_active { get; set; }
        public List<banks> banks { get; set; }
    }
}
