const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})
const router = vertex.router()
const controllers = require('../controllers')

router.get('/', (req, res) => {
	const data = req.context // {cdn:<STRING>, global:<OBJECT>}

	const ctr = new controllers.project()
	ctr.get()
	.then(projects => {
		data['projects'] = projects
		const servicesCtr = new controllers.service()
		return servicesCtr.get()
	})
	.then(services => {
		data['services'] = services
		const postsCtr = new controllers.post()
		return postsCtr.get()
	})
	.then(posts => {
		data['posts'] = posts
		data['post1'] = posts[0]
		data['post2'] = posts[1]
		data['post3'] = posts[2]

		res.render('home', data) // render home.mustache
	})
	.catch(err => {
		res.json({
			confirmation: 'fail',
			message: err.message
		})
	})
})

router.get('/blog', (req, res) => {
	const data = req.config // {cdn:<STRING>, global:<OBJECT>}

	let ctr = new controllers.post()
	ctr.get()
	.then(posts => {
		data['posts'] = posts
    	res.render('blog', data)
	})
	.catch(err => {
		res.json({
			confirmation: 'fail',
			message: err.message
		})
	})
})

router.get('/project/:slug', (req, res) => {
	const data = req.config // {cdn:<STRING>, global:<OBJECT>}

	let ctr = new controllers.project()
	ctr.get({slug:req.params.slug})
	.then(posts => {
		if (posts.length == 0){
			throw new Error('Project '+req.params.slug+' not found.')
			return
		}

		data['project'] = posts[0]
		data.setEntity(data.project)
		res.render('project', data)
	})
	.catch(err => {
		res.json({
			confirmation: 'fail',
			message: err.message
		})
	})
})

router.get('/post/:slug', (req, res) => {
	const data = req.config // {cdn:<STRING>, global:<OBJECT>}

	let ctr = new controllers.post()
	ctr.get({slug:req.params.slug})
	.then(posts => {
		if (posts.length == 0){
			throw new Error('Post '+req.params.slug+' not found.')
			return
		}

		data['post'] = posts[0]
		data.setEntity(data.post)
		res.render('post', data)
	})
	.catch(err => {
		res.json({
			confirmation: 'fail',
			message: err.message
		})
	})
})

module.exports = router
