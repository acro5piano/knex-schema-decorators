import { Knex } from 'knex'

export let knexInstance: Knex

export function setKnex(knex: Knex) {
  knexInstance = knex
}
