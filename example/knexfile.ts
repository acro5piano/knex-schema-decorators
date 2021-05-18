const knexStringcase = require('knex-stringcase')

export default knexStringcase({
  client: 'pg',
  connection: 'postgres://postgres:postgres@127.0.0.1:11000/postgres',
  useNullAsDefault: false,
})
