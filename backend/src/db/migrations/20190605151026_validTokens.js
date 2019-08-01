exports.up = (knex, Promise) => {
  return knex.schema
    .createTable('validTokens', table => {
      table.increments()
      table.uuid('uuid', 36).notNull()
      table.timestamp('expiredAt', { useTz: true }).notNull()

      table.integer('userId').references('id').inTable('users').onDelete('CASCADE')
      table.string('clientFingerprint', 200).notNull()

      table.timestamp('createdAt', { useTz: true }).defaultTo(knex.fn.now()).notNull()
      table.timestamp('updatedAt', { useTz: true }).defaultTo(knex.fn.now()).notNull()
    })
}

exports.down = (knex, Promise) => knex.schema.dropTable('validTokens')
