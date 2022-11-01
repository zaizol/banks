using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace bank.Models
{
    public class m_customer
    {
        public string iban { get; set; }
        public string fullname { get; set; }
        public List<account> accounts { get; set; }
    }

    public class account {
        public string bankname { get; set; }
        public string accountname { get; set; }
        public string accountno { get; set; }
        public decimal amt { get; set; }
    }

}
