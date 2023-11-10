import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'
import { checkSessionIdExist } from '../middlewares/check-session-id-exist'

/**
 * Testes
 *
 * - Unitários
 * Testar uma unidade da aplicação, teste que mais tem
 * por ser mais fácil da fazer
 *
 * - Integração
 * Teste de duas ou mais unidades
 *
 * - e2e (ponta a ponta)
 * Testes que simulam um usuário utilizando a aplicação
 * Um teste e2e no backend é chamadas HTTP utilizando todos os
 * recursos da aplicação, rota, controller use case até o bando de dados
 *
 * Pirâmide de testes
 *
 * O test mais fácil é o teste e2e porque ele não depende de nada, de software
 * libs ou arquitetura (custo, são os testes mais lentos)
 *
 * e2e > teste de integração > teste unitário (factíveis)
 */

// Cookies <--> Formas de manter contexto dentre requisições

// Cada plugin existe apenas dentro do propino contexto
export async function transactionsRoutes(app: FastifyInstance) {
  // app.addHook('preHandler', async (req, reply) => {
  //   console.log('Hook global dentro de um contexto')
  // })

  // GET POST PUT PATCH DELETE
  // o primeiro parâmetro apos apos a barra é o RECURSO!
  app.post('/', async (req, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { amount, title, type } = createTransactionBodySchema.parse(req.body)

    let sessionId = req.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias (clean code)
      })
    }

    await knex('transactions').insert({
      id: randomUUID(),
      amount: type === 'credit' ? amount : amount * -1,
      title,
      session_id: sessionId,
    })

    return reply.status(201).send()
  })

  /**
   * Não é uma boa prática retornar a informações direto no objeto
   * principal, porque se um dia precisar retornar mais alguma informação
   * seria necessário refatorar todos os locais que está utilizando essa rota
   */
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExist],
    },
    async (req) => {
      const { sessionId } = req.cookies

      const transactions = await knex('transactions')
        .where({
          session_id: sessionId,
        })
        .select()

      return {
        transactions,
      }
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExist],
    },
    async (req) => {
      const { sessionId } = req.cookies

      const getTransactionParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getTransactionParamsSchema.parse(req.params)

      const transaction = await knex('transactions')
        .where({
          id,
          session_id: sessionId,
        })
        .first()

      return {
        transaction,
      }
    },
  )

  app.get(
    '/summary',
    {
      preHandler: [checkSessionIdExist],
    },
    async (req) => {
      const { sessionId } = req.cookies

      const summary = await knex('transactions')
        .where({
          session_id: sessionId,
        })
        .sum('amount', {
          as: 'amount',
        })
        .first()

      return { summary }
    },
  )
}
