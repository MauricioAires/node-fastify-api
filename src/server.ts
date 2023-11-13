import { app } from './app'
import { env } from './env'

app
  .listen({
    port: env.PORT,
    host: 'RENDER' in process.env ? '0.0.0.0' : 'localhost',
  })
  .then(() => {
    console.log(`HTTP server running on port ${env.PORT}`)
  })

/**
 *  A lib tsx deve ser utilizada apenas em ambiente de desenvolvimento
 * para produção o o projeto deve ser realmente convertido para js
 * e executado utilizando o node src/server.js
 */
