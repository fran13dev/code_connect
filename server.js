const express = require('express'),
	PORT = process.env.PORT || 5000,
	connectDB = require('./config/db'),
	helmet = require('helmet'),
	path = require('path')

const app = express()

// connect to the database
connectDB()

// middleware
app.use(express.json({ extended: false }))
app.use(helmet())

// import routes
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/users', require('./routes/api/users'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/posts', require('./routes/api/posts'))

// serve static assets in production
if (process.env.NODE_ENV === 'production') {
	// set static folder
	app.use(express.static('client/build'))

	app.get('*', (req, res) => {
		res.sendfile(path.resolve(__dirname, 'client/build', 'index.html'))
	})
}

app.listen(PORT, () => console.log(`Server is listening on port: ${PORT}`))
