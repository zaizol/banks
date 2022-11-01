using Microsoft.EntityFrameworkCore.Migrations;

namespace bank.Migrations
{
    public partial class addfeeamt : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "feeamt",
                table: "txn_banks",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "feeamt",
                table: "txn_banks");
        }
    }
}
