exports.up = (knex, Promise) => {
  return knex.schema
    .createTable('posts', table => {
      table.increments()
      table.integer('userId').references('id').inTable('users').onDelete('CASCADE')
      table.string('title', 20).notNull()
      table.string('content', 5000)

      table.timestamp('createdAt', { useTz: true }).defaultTo(knex.fn.now()).notNull()
      table.timestamp('updatedAt', { useTz: true }).defaultTo(knex.fn.now()).notNull()
    })
}

exports.down = (knex, Promise) => knex.schema.dropTable('posts')
