import { Knex } from 'knex'

/**
 * UMA MIGRATION APOS SER ENVIADA PARA PRODUÇÃO
 * NUNCA MAIS ELA PODERÁ SER EXECUTADA!!
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('transactions', (table) => {
    table.uuid('id').primary()
    table.text('title').notNullable()
    table.decimal('amount', 10, 2).notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  })
}

// Desfazer tudo que fez no método up
export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('transactions')
}
