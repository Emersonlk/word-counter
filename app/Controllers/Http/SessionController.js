'use strict'

class SessionController {
  async create ({ view }) {
    return view.render('auth.login')
  }

  async store ({ request, response, auth, session }) {
    const { email, password, remember } = request.post()

    try {
      await auth
        .remember(!!remember)
        .attempt(email, password)
      } catch (error) {
        session.withErrors({ login: 'Email ou senha inválidos' }).flashAll()
        
        return response.redirect('back')
      }

    return response.redirect('/novo')
  }

  async destroy ({ response, auth }) {
    await auth.logout()

    return response.redirect('/')
  }
}

module.exports = SessionController
