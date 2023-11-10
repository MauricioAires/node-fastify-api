import { knex as setupKnex, Knex } from 'knex'
import { env } from './env'

export const config: Knex.Config = {
  client: 'sqlite',
  connection: {
    filename: env.DATABASE_URL,
  },
  // Por padrão todos os campos do banco vair ser null
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './database/migrations',
  },
}

export const knex = setupKnex(config)
