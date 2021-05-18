import { Knex } from 'knex'

export async function up(knex: Knex) {
  await knex.raw(`create table "users" ("id" bigserial primary key, "name" varchar(255) not null default '', "is_deleted" boolean not null default '0', "status" text check ("status" in ('online', 'away', 'offline')) not null default 'online', "created_at" timestamptz not null)`)
}

export async function down(_knex: Knex) {
  // No down supported
}
        