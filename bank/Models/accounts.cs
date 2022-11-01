using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace bank.Models
{
    public class accounts
    {

        [Key]
        [Required]
        [StringLength(50)]
        public string iban_no { get; set; }
        [StringLength(100)]
        public string fullname { get; set; }
        public DateTime? created_date { get; set; }
        [StringLength(50)]
        public string created_by { get; set; }
        public DateTime? updated_date { get; set; }
        [StringLength(50)]
        public string updated_by { get; set; }
        public bool is_active { get; set; }
    }
}
