'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
  Route.get('/', 'SessionController.create')
  Route.get('/entrar', 'SessionController.create')
  Route.get('/cadastrar', 'UserController.create')
  
  Route.post('/entrar', 'SessionController.store')
  Route.post('/cadastrar', 'UserController.store')
}).middleware(async ({ response, auth }, next) => {
  try {
    await auth.check()
    return response.redirect('/novo')
  } catch (error) {
    return next()
  }
})

Route.group(() => {
  Route.get('/novo', 'FileController.create')
  Route.post('/novo', 'FileController.store')
  Route.get('/historico', 'FileController.index')
  Route.get('/detalhes/:id', 'FileController.show')
  Route.get('/sair', 'SessionController.destroy')
}).middleware('auth')
