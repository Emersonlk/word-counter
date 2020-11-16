'use strict'

const User = use('App/Models/User')

class UserController {
  async create ({ view }) {
    return view.render('auth.register')
  }

  async store ({ request, response, auth, session }) {
    const data = request.only(['name', 'email', 'password'])
    
    try {
      await User.create(data)

      await auth.attempt(data.email, data.password)
    } catch (error) {
      if (await User.findBy({ email: data.email })) {
        session
          .withErrors({ email: 'Este email já está cadastrado no sistema' })
          .flashAll()
      } else {
        session.withErrors({ register: 'Dados inválidos' }).flashAll()
      }
      
      return response.redirect('back')
    }

    return response.redirect('/novo')
  }
}

module.exports = UserController
