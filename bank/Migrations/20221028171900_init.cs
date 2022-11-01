using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace bank.Migrations
{
    public partial class init : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "accounts",
                columns: table => new
                {
                    iban_no = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    fullname = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    created_date = table.Column<DateTime>(type: "datetime", nullable: true),
                    created_by = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    updated_date = table.Column<DateTime>(type: "datetime", nullable: true),
                    updated_by = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    is_active = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_accounts", x => x.iban_no);
                });

            migrationBuilder.CreateTable(
                name: "banks",
                columns: table => new
                {
                    bank_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    iban_no = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    bank_name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    bank_account = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    bank_account_name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    created_date = table.Column<DateTime>(type: "datetime", nullable: true),
                    created_by = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    updated_date = table.Column<DateTime>(type: "datetime", nullable: true),
                    updated_by = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    is_active = table.Column<bool>(type: "bit", nullable: false),
                    bank_order = table.Column<int>(type: "int", nullable: false),
                    bank_balanceAmt = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_banks", x => x.bank_id);
                });

            migrationBuilder.CreateTable(
                name: "txn_banks",
                columns: table => new
                {
                    txn_bank_id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    bank_id = table.Column<int>(type: "int", nullable: false),
                    iban_no = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    amt = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    functional_type = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    financial_type = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    old_balance = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    new_balance = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    created_date = table.Column<DateTime>(type: "datetime", nullable: true),
                    created_by = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_txn_banks", x => x.txn_bank_id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "accounts");

            migrationBuilder.DropTable(
                name: "banks");

            migrationBuilder.DropTable(
                name: "txn_banks");
        }
    }
}
