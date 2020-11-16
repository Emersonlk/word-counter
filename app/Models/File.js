'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class File extends Model {
  author () {
    return this.belongsTo('App/Models/User')
  }
}

module.exports = File
