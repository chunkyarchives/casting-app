using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CastingApp.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddApplicationPosition : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "position",
                table: "application",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "position",
                table: "application");
        }
    }
}
