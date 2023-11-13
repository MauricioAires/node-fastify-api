import { config } from 'dotenv'
import { z } from 'zod'

if (process.env.NODE_ENV === 'test') {
  config({
    path: '.env.test',
    override: true,
  })
} else {
  config()
}

// joy, yup, zod
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_URL: z.string(),
  DATABASE_CLIENT: z.enum(['sqlite', 'pg']),
  PORT: z.coerce.number().default(3333),
})

/**
 *  Com esse tipo de arquivo de "env" é possível
 * validar o preenchimento de variáveis obrigatórias
 * valor das varias se é string ou number e também gerar um
 * intellisense
 */
const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('🐥 - Invalid environment variables', _env.error.format())
  throw new Error('Invalid environment variables')
}

export const env = _env.data
