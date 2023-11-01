import fastify from 'fastify'
import { knex } from './database'

const app = fastify()

// GET POST PUT PATCH DELETE
// o primeiro parâmetro apos apos a barra é o RECURSO!

app.get('/hello', async () => {
  const test = await knex('sqlite_schema').select('*')

  return test
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP server running on port 3333')
  })

/**
 *  A lib tsx deve ser utilizada apenas em ambiente de desenvolvimento
 * para produção o o projeto deve ser realmente convertido para js
 * e executado utilizando o node src/server.js
 */
