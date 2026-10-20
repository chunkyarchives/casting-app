using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CastingApp.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddAdminAudit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "admin_audit",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    admin_id = table.Column<Guid>(type: "uuid", nullable: false),
                    admin_email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    action = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    target_type = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    target_id = table.Column<Guid>(type: "uuid", nullable: false),
                    target_label = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    reason = table.Column<string>(type: "character varying(600)", maxLength: 600, nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_admin_audit", x => x.id);
                    table.CheckConstraint("ck_admin_audit_action", "action IN ('LockAccount','UnlockAccount','ForceLogout','DeleteAccount','DeleteFilm','DeleteConversation')");
                });

            migrationBuilder.CreateIndex(
                name: "ix_admin_audit_created_at",
                table: "admin_audit",
                column: "created_at");

            migrationBuilder.CreateIndex(
                name: "ix_admin_audit_target",
                table: "admin_audit",
                column: "target_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "admin_audit");
        }
    }
}
