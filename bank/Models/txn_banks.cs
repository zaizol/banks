using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace bank.Models
{
    public class txn_banks
    {
        [Key]
        public Int64 txn_bank_id { get; set; }
        public int bank_id { get; set; }
        [Required]
        [StringLength(50)]
        public string iban_no { get; set; }
        public decimal amt { get; set; }
        public decimal feeamt { get; set; }
        [StringLength(50)]
        public string functional_type { get; set; }
        [StringLength(50)]
        public string financial_type { get; set; }
        public decimal old_balance { get; set; }
        public decimal new_balance { get; set; }
        public DateTime? created_date { get; set; }
        [StringLength(50)]
        public string created_by { get; set; }
    }
}