using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace bank.Models
{
    public class bankDBContext : DbContext
    {
        public bankDBContext()
        { }
        public bankDBContext(DbContextOptions<bankDBContext> options)
            : base(options)
        { }

        public virtual DbSet<accounts> accounts { get; set; }
        public virtual DbSet<banks> banks { get; set; }
        public virtual DbSet<txn_banks> txn_banks { get; set; }
        public virtual DbSet<v_txn> v_txn { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder
             .Entity<v_txn>(eb =>
             {
                 eb.HasNoKey();
                 eb.ToView("v_txn");
             });
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                IConfigurationRoot configuration = new ConfigurationBuilder()
                   .SetBasePath(Directory.GetCurrentDirectory())
                   .AddJsonFile("appsettings.json")
                   .Build();
                var connectionString = configuration.GetConnectionString("bankConnection");
                optionsBuilder.UseSqlServer(connectionString);
            }
        }
    }
}
