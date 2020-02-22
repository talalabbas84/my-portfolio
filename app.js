// Full Documentation - https://www.turbo360.co/docs
const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})
const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const path = require('path')

const config = {
	views: 'views', 	// Set views directory
	static: 'public', // Set static assets directory
	logging: true,
	db: vertex.nedbConfig((process.env.TURBO_ENV=='dev') ? 'nedb://'+path.join(__dirname, process.env.TMP_DIR) : 'nedb://'+process.env.TMP_DIR)
}

const app = vertex.app(config) // initialize app with config options
app.use(vertex.setContext(process.env)) // set CDN and global object on 'req.config' and 'req.site' object


// import routes
const page = require('./routes/page')
const vertexRouters = require('./routes/vertex')

// set routes
app.use('/', page)
app.use('/api', vertexRouters.api)
app.use('/blocks', vertexRouters.blocks)


module.exports = app
