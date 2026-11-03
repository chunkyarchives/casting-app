using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CastingApp.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddCrewAdminActions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "ck_admin_audit_action",
                table: "admin_audit");

            migrationBuilder.AddCheckConstraint(
                name: "ck_admin_audit_action",
                table: "admin_audit",
                sql: "action IN ('LockAccount','UnlockAccount','ForceLogout','DeleteAccount','DeleteFilm','DeleteConversation','DeleteCrew','RemoveCrewMember','RegenerateCrewCode')");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "ck_admin_audit_action",
                table: "admin_audit");

            migrationBuilder.AddCheckConstraint(
                name: "ck_admin_audit_action",
                table: "admin_audit",
                sql: "action IN ('LockAccount','UnlockAccount','ForceLogout','DeleteAccount','DeleteFilm','DeleteConversation')");
        }
    }
}
