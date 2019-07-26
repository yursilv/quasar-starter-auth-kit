exports.up = (knex, Promise) => {
  return knex.schema
    .createTable('valid_tokens', table => {
      table.increments()
      table.uuid('uuid', 36).notNull()
      table.integer('userId').references('id').inTable('users').onDelete('CASCADE')
      table.string('clientFingerprint', 200).notNull()
      table.timestamp('expiredAt', { useTz: false }).notNull()
      table.timestamp('createdAt', { useTz: false }).defaultTo(knex.fn.now()).notNull()
      table.timestamp('updatedAt', { useTz: false }).defaultTo(knex.fn.now()).notNull()
    })
}

exports.down = (knex, Promise) => knex.schema.dropTable('valid_tokens')
