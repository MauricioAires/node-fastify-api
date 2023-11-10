import { beforeEach, describe, it, beforeAll, afterAll, expect } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    // Remover a aplicação da memoria
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      })
      .expect(201)
  })

  it('should be able to list all transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)

    expect(listTransactionResponse.statusCode).toEqual(200)

    // Essa solução é para quanto tem poucos campo ou
    // vc quer especificar todos eles
    expect(listTransactionResponse.body).toEqual({
      transactions: [
        {
          id: expect.any(String),
          session_id: expect.any(String),
          created_at: expect.any(String),
          title: 'New transaction',
          amount: 5000,
        },
      ],
    })

    // Forma genérica
    expect(listTransactionResponse.body).toEqual({
      transactions: [
        expect.objectContaining({
          title: 'New transaction',
          amount: 5000,
        }),
      ],
    })
  })

  /**
   *  O teste deve se adaptar ao código e não o código deve
   * se adaptar ao teste
   */
  it('should be able to get a specif transaction', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)

    const transactionId = listTransactionResponse.body.transactions[0].id

    const getTransactionIdResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)

    expect(getTransactionIdResponse.body.transaction).toEqual(
      expect.objectContaining({
        amount: 5000,
        title: 'New transaction',
      }),
    )
  })

  it('should be able to get the summary', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({
        title: 'Debit transaction',
        amount: 2000,
        type: 'debit',
      })

    const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)

    expect(summaryResponse.body.summary).toEqual({
      amount: 3000,
    })
  })
})
