using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace CastingApp.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "participant",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    first_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    last_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    role = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    user_name = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: true),
                    normalized_user_name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    normalized_email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    email_confirmed = table.Column<bool>(type: "boolean", nullable: false),
                    password_hash = table.Column<string>(type: "text", nullable: true),
                    security_stamp = table.Column<string>(type: "text", nullable: true),
                    concurrency_stamp = table.Column<string>(type: "text", nullable: true),
                    phone_number = table.Column<string>(type: "text", nullable: true),
                    phone_number_confirmed = table.Column<bool>(type: "boolean", nullable: false),
                    two_factor_enabled = table.Column<bool>(type: "boolean", nullable: false),
                    lockout_end = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    lockout_enabled = table.Column<bool>(type: "boolean", nullable: false),
                    access_failed_count = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_participant", x => x.id);
                    table.CheckConstraint("ck_participant_role", "role IN ('Actor','Director','CastingDirector','Admin')");
                });

            migrationBuilder.CreateTable(
                name: "actor",
                columns: table => new
                {
                    participant_id = table.Column<Guid>(type: "uuid", nullable: false),
                    date_of_birth = table.Column<DateOnly>(type: "date", nullable: true),
                    weight = table.Column<int>(type: "integer", nullable: true),
                    height = table.Column<int>(type: "integer", nullable: true),
                    origin = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    gender = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    bio = table.Column<string>(type: "text", nullable: true),
                    links = table.Column<string>(type: "jsonb", nullable: false),
                    role_interests = table.Column<string>(type: "jsonb", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_actor", x => x.participant_id);
                    table.ForeignKey(
                        name: "fk_actor_asp_net_users_participant_id",
                        column: x => x.participant_id,
                        principalTable: "participant",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "casting_director",
                columns: table => new
                {
                    participant_id = table.Column<Guid>(type: "uuid", nullable: false),
                    date_of_birth = table.Column<DateOnly>(type: "date", nullable: true),
                    gender = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_casting_director", x => x.participant_id);
                    table.ForeignKey(
                        name: "fk_casting_director_asp_net_users_participant_id",
                        column: x => x.participant_id,
                        principalTable: "participant",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "director",
                columns: table => new
                {
                    participant_id = table.Column<Guid>(type: "uuid", nullable: false),
                    date_of_birth = table.Column<DateOnly>(type: "date", nullable: true),
                    origin = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    bio = table.Column<string>(type: "text", nullable: true),
                    gender = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_director", x => x.participant_id);
                    table.ForeignKey(
                        name: "fk_director_asp_net_users_participant_id",
                        column: x => x.participant_id,
                        principalTable: "participant",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "participant_claim",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    claim_type = table.Column<string>(type: "text", nullable: true),
                    claim_value = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_participant_claim", x => x.id);
                    table.ForeignKey(
                        name: "fk_participant_claim_participant_user_id",
                        column: x => x.user_id,
                        principalTable: "participant",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "participant_login",
                columns: table => new
                {
                    login_provider = table.Column<string>(type: "text", nullable: false),
                    provider_key = table.Column<string>(type: "text", nullable: false),
                    provider_display_name = table.Column<string>(type: "text", nullable: true),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_participant_login", x => new { x.login_provider, x.provider_key });
                    table.ForeignKey(
                        name: "fk_participant_login_participant_user_id",
                        column: x => x.user_id,
                        principalTable: "participant",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "participant_token",
                columns: table => new
                {
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    login_provider = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    value = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_participant_token", x => new { x.user_id, x.login_provider, x.name });
                    table.ForeignKey(
                        name: "fk_participant_token_participant_user_id",
                        column: x => x.user_id,
                        principalTable: "participant",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "conversation",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    actor_id = table.Column<Guid>(type: "uuid", nullable: false),
                    director_id = table.Column<Guid>(type: "uuid", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_conversation", x => x.id);
                    table.ForeignKey(
                        name: "fk_conversation_actor_actor_id",
                        column: x => x.actor_id,
                        principalTable: "actor",
                        principalColumn: "participant_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_conversation_director_director_id",
                        column: x => x.director_id,
                        principalTable: "director",
                        principalColumn: "participant_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "crew",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    director_id = table.Column<Guid>(type: "uuid", nullable: false),
                    production_name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    production_code = table.Column<string>(type: "character varying(6)", maxLength: 6, nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_crew", x => x.id);
                    table.CheckConstraint("ck_crew_production_code", "production_code ~ '^[A-Z0-9]{6}$'");
                    table.ForeignKey(
                        name: "fk_crew_director_director_id",
                        column: x => x.director_id,
                        principalTable: "director",
                        principalColumn: "participant_id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "film",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    director_id = table.Column<Guid>(type: "uuid", nullable: false),
                    title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    content_rating = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    release_year = table.Column<int>(type: "integer", nullable: true),
                    status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_film", x => x.id);
                    table.CheckConstraint("ck_film_status", "status IN ('Active','Archived')");
                    table.ForeignKey(
                        name: "fk_film_director_director_id",
                        column: x => x.director_id,
                        principalTable: "director",
                        principalColumn: "participant_id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "message",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    conversation_id = table.Column<Guid>(type: "uuid", nullable: false),
                    sender_id = table.Column<Guid>(type: "uuid", nullable: false),
                    content = table.Column<string>(type: "text", nullable: false),
                    sent_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_message", x => x.id);
                    table.ForeignKey(
                        name: "fk_message_asp_net_users_sender_id",
                        column: x => x.sender_id,
                        principalTable: "participant",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_message_conversation_conversation_id",
                        column: x => x.conversation_id,
                        principalTable: "conversation",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "crew_membership",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    crew_id = table.Column<Guid>(type: "uuid", nullable: false),
                    casting_director_id = table.Column<Guid>(type: "uuid", nullable: false),
                    joined_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_crew_membership", x => x.id);
                    table.ForeignKey(
                        name: "fk_crew_membership_casting_director_casting_director_id",
                        column: x => x.casting_director_id,
                        principalTable: "casting_director",
                        principalColumn: "participant_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_crew_membership_crew_crew_id",
                        column: x => x.crew_id,
                        principalTable: "crew",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "film_role",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    film_id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    age_min = table.Column<int>(type: "integer", nullable: true),
                    age_max = table.Column<int>(type: "integer", nullable: true),
                    height_min = table.Column<int>(type: "integer", nullable: true),
                    height_max = table.Column<int>(type: "integer", nullable: true),
                    weight_min = table.Column<int>(type: "integer", nullable: true),
                    weight_max = table.Column<int>(type: "integer", nullable: true),
                    gender = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    origin = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    row_version = table.Column<int>(type: "integer", nullable: false, defaultValue: 0)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_film_role", x => x.id);
                    table.CheckConstraint("ck_film_role_status", "status IN ('Open','Filled')");
                    table.ForeignKey(
                        name: "fk_film_role_film_film_id",
                        column: x => x.film_id,
                        principalTable: "film",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "application",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    film_role_id = table.Column<Guid>(type: "uuid", nullable: false),
                    actor_id = table.Column<Guid>(type: "uuid", nullable: false),
                    proposed_by_id = table.Column<Guid>(type: "uuid", nullable: true),
                    status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    decided_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_application", x => x.id);
                    table.CheckConstraint("ck_application_status", "status IN ('Proposed','Accepted','Rejected')");
                    table.ForeignKey(
                        name: "fk_application_actor_actor_id",
                        column: x => x.actor_id,
                        principalTable: "actor",
                        principalColumn: "participant_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_application_casting_director_proposed_by_id",
                        column: x => x.proposed_by_id,
                        principalTable: "casting_director",
                        principalColumn: "participant_id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "fk_application_film_role_film_role_id",
                        column: x => x.film_role_id,
                        principalTable: "film_role",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_application_actor_id",
                table: "application",
                column: "actor_id");

            migrationBuilder.CreateIndex(
                name: "ix_application_proposed_by_id",
                table: "application",
                column: "proposed_by_id");

            migrationBuilder.CreateIndex(
                name: "uq_application",
                table: "application",
                columns: new[] { "film_role_id", "actor_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "uq_application_one_accepted",
                table: "application",
                column: "film_role_id",
                unique: true,
                filter: "status = 'Accepted'");

            migrationBuilder.CreateIndex(
                name: "ix_conversation_director_id",
                table: "conversation",
                column: "director_id");

            migrationBuilder.CreateIndex(
                name: "uq_conversation",
                table: "conversation",
                columns: new[] { "actor_id", "director_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_crew_director_id",
                table: "crew",
                column: "director_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_crew_production_code",
                table: "crew",
                column: "production_code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_crew_membership_casting_director_id",
                table: "crew_membership",
                column: "casting_director_id");

            migrationBuilder.CreateIndex(
                name: "uq_crew_member",
                table: "crew_membership",
                columns: new[] { "crew_id", "casting_director_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_film_director_id",
                table: "film",
                column: "director_id");

            migrationBuilder.CreateIndex(
                name: "ix_film_role_film_id",
                table: "film_role",
                column: "film_id");

            migrationBuilder.CreateIndex(
                name: "ix_message_conversation_id_sent_at",
                table: "message",
                columns: new[] { "conversation_id", "sent_at" });

            migrationBuilder.CreateIndex(
                name: "ix_message_sender_id",
                table: "message",
                column: "sender_id");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "participant",
                column: "normalized_email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "participant",
                column: "normalized_user_name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_participant_claim_user_id",
                table: "participant_claim",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_participant_login_user_id",
                table: "participant_login",
                column: "user_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "application");

            migrationBuilder.DropTable(
                name: "crew_membership");

            migrationBuilder.DropTable(
                name: "message");

            migrationBuilder.DropTable(
                name: "participant_claim");

            migrationBuilder.DropTable(
                name: "participant_login");

            migrationBuilder.DropTable(
                name: "participant_token");

            migrationBuilder.DropTable(
                name: "film_role");

            migrationBuilder.DropTable(
                name: "casting_director");

            migrationBuilder.DropTable(
                name: "crew");

            migrationBuilder.DropTable(
                name: "conversation");

            migrationBuilder.DropTable(
                name: "film");

            migrationBuilder.DropTable(
                name: "actor");

            migrationBuilder.DropTable(
                name: "director");

            migrationBuilder.DropTable(
                name: "participant");
        }
    }
}
