using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CastingApp.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddMediaGallery : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "profile_picture_id",
                table: "participant",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "media_asset",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    owner_id = table.Column<Guid>(type: "uuid", nullable: false),
                    kind = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    caption = table.Column<string>(type: "character varying(140)", maxLength: 140, nullable: true),
                    storage_key = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    content_type = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    size_bytes = table.Column<long>(type: "bigint", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_media_asset", x => x.id);
                    table.CheckConstraint("ck_media_asset_kind", "kind IN ('ProfilePicture','Headshot','FullBody','ProductionStill','Showreel')");
                    table.ForeignKey(
                        name: "fk_media_asset_asp_net_users_owner_id",
                        column: x => x.owner_id,
                        principalTable: "participant",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_participant_profile_picture_id",
                table: "participant",
                column: "profile_picture_id");

            migrationBuilder.CreateIndex(
                name: "ix_media_asset_owner_kind",
                table: "media_asset",
                columns: new[] { "owner_id", "kind" });

            migrationBuilder.AddForeignKey(
                name: "fk_participant_media_asset_profile_picture_id",
                table: "participant",
                column: "profile_picture_id",
                principalTable: "media_asset",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_participant_media_asset_profile_picture_id",
                table: "participant");

            migrationBuilder.DropTable(
                name: "media_asset");

            migrationBuilder.DropIndex(
                name: "ix_participant_profile_picture_id",
                table: "participant");

            migrationBuilder.DropColumn(
                name: "profile_picture_id",
                table: "participant");
        }
    }
}
