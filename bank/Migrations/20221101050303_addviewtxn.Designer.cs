﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using bank.Models;

namespace bank.Migrations
{
    [DbContext(typeof(bankDBContext))]
    [Migration("20221101050303_addviewtxn")]
    partial class addviewtxn
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("ProductVersion", "5.0.13")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("bank.Models.accounts", b =>
                {
                    b.Property<string>("iban_no")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("created_by")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<DateTime?>("created_date")
                        .HasColumnType("datetime2");

                    b.Property<string>("fullname")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<bool>("is_active")
                        .HasColumnType("bit");

                    b.Property<string>("updated_by")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<DateTime?>("updated_date")
                        .HasColumnType("datetime2");

                    b.HasKey("iban_no");

                    b.ToTable("accounts");
                });

            modelBuilder.Entity("bank.Models.banks", b =>
                {
                    b.Property<int>("bank_id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("bank_account")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("bank_account_name")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<decimal>("bank_balanceAmt")
                        .HasColumnType("decimal(18,2)");

                    b.Property<string>("bank_name")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<int>("bank_order")
                        .HasColumnType("int");

                    b.Property<string>("created_by")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<DateTime?>("created_date")
                        .HasColumnType("datetime2");

                    b.Property<string>("iban_no")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<bool>("is_active")
                        .HasColumnType("bit");

                    b.Property<string>("updated_by")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<DateTime?>("updated_date")
                        .HasColumnType("datetime2");

                    b.HasKey("bank_id");

                    b.ToTable("banks");
                });

            modelBuilder.Entity("bank.Models.txn_banks", b =>
                {
                    b.Property<long>("txn_bank_id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<decimal>("amt")
                        .HasColumnType("decimal(18,2)");

                    b.Property<int>("bank_id")
                        .HasColumnType("int");

                    b.Property<string>("created_by")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<DateTime?>("created_date")
                        .HasColumnType("datetime2");

                    b.Property<decimal>("feeamt")
                        .HasColumnType("decimal(18,2)");

                    b.Property<string>("financial_type")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("functional_type")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("iban_no")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<decimal>("new_balance")
                        .HasColumnType("decimal(18,2)");

                    b.Property<decimal>("old_balance")
                        .HasColumnType("decimal(18,2)");

                    b.HasKey("txn_bank_id");

                    b.ToTable("txn_banks");
                });

            modelBuilder.Entity("bank.Models.v_txn", b =>
                {
                    b.Property<decimal>("amt")
                        .HasColumnType("decimal(18,2)");

                    b.Property<string>("bank_account")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("bank_account_name")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<int>("bank_id")
                        .HasColumnType("int");

                    b.Property<string>("bank_name")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("created_by")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<DateTime?>("created_date")
                        .HasColumnType("datetime2");

                    b.Property<decimal>("feeamt")
                        .HasColumnType("decimal(18,2)");

                    b.Property<string>("financial_type")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("functional_type")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("iban_no")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<decimal>("new_balance")
                        .HasColumnType("decimal(18,2)");

                    b.Property<decimal>("old_balance")
                        .HasColumnType("decimal(18,2)");

                    b.Property<long>("txn_bank_id")
                        .HasColumnType("bigint");

                    b.ToView("v_txn");
                });
#pragma warning restore 612, 618
        }
    }
}
