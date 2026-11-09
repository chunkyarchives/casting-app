using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CastingApp.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddAccountPrivacy : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "deactivated_until",
                table: "participant",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "is_profile_public",
                table: "participant",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "origin",
                table: "casting_director",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "deactivated_until",
                table: "participant");

            migrationBuilder.DropColumn(
                name: "is_profile_public",
                table: "participant");

            migrationBuilder.DropColumn(
                name: "origin",
                table: "casting_director");
        }
    }
}
