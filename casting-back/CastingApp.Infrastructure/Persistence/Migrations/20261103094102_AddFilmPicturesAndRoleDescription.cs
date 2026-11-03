using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CastingApp.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddFilmPicturesAndRoleDescription : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "ck_media_asset_kind",
                table: "media_asset");

            migrationBuilder.AddColumn<Guid>(
                name: "film_role_id",
                table: "media_asset",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "description",
                table: "film_role",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "poster_id",
                table: "film",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "ix_media_asset_film_role_id",
                table: "media_asset",
                column: "film_role_id");

            migrationBuilder.AddCheckConstraint(
                name: "ck_media_asset_kind",
                table: "media_asset",
                sql: "kind IN ('ProfilePicture','Headshot','FullBody','ProductionStill','Showreel','FilmPoster','RoleConceptArt')");

            migrationBuilder.CreateIndex(
                name: "ix_film_poster_id",
                table: "film",
                column: "poster_id");

            migrationBuilder.AddForeignKey(
                name: "fk_film_media_asset_poster_id",
                table: "film",
                column: "poster_id",
                principalTable: "media_asset",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "fk_media_asset_film_role_film_role_id",
                table: "media_asset",
                column: "film_role_id",
                principalTable: "film_role",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_film_media_asset_poster_id",
                table: "film");

            migrationBuilder.DropForeignKey(
                name: "fk_media_asset_film_role_film_role_id",
                table: "media_asset");

            migrationBuilder.DropIndex(
                name: "ix_media_asset_film_role_id",
                table: "media_asset");

            migrationBuilder.DropCheckConstraint(
                name: "ck_media_asset_kind",
                table: "media_asset");

            migrationBuilder.DropIndex(
                name: "ix_film_poster_id",
                table: "film");

            migrationBuilder.DropColumn(
                name: "film_role_id",
                table: "media_asset");

            migrationBuilder.DropColumn(
                name: "description",
                table: "film_role");

            migrationBuilder.DropColumn(
                name: "poster_id",
                table: "film");

            migrationBuilder.AddCheckConstraint(
                name: "ck_media_asset_kind",
                table: "media_asset",
                sql: "kind IN ('ProfilePicture','Headshot','FullBody','ProductionStill','Showreel')");
        }
    }
}
