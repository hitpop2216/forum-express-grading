const express = require('express')
const routes = require('./routes')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const handlebars = require('express-handlebars')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport')
const methodOverride = require('method-override')
const { getUser } = require('./helpers/auth-helpers')
const handlebarsHelpers = require('./helpers/handlebars-helpers')
const app = express()
const path = require('path')
const port = process.env.PORT || 3000

app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(methodOverride('_method'))
app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = getUser(req)
  next()
})
app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
