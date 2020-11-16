const { hooks } = require('@adonisjs/ignitor')

hooks.after.providersBooted(() => {
  const Env = use('Env')
  const View = use('View')
  const Exception = use('Exception')

  View.global('appName', () => Env.get('APP_NAME'))

  Exception.handle('InvalidSessionException', (error, { response }) => {
    return response.redirect('/')
  })
})
