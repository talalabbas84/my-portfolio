const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})
const Controller = vertex.Controller
const Project = require('../models/Project')

class ProjectController extends Controller {
	constructor(){
		super(Project, process.env)
	}

	get(params) {
		return new Promise((resolve, reject) => {
			Controller.checkCollectionDB(Project.collectionName())
			.then(data => {
				return Project.find(params, Controller.parseFilters(params))
			})
			.then(projects => {
				resolve(Project.convertToJson(projects))
			})
			.catch(err => {
				reject(err)
			})
		})
	}

	getById(id) {
		return new Promise((resolve, reject) => {
			Controller.checkCollectionDB(Project.collectionName())
			.then(data => {
				return Project.findById(id)
			})
			.then(project => {
				if (project == null){
					throw new Error(Project.resourceName + ' ' + id + ' not found.')
					return
				}

				resolve(project.summary())
			})
			.catch(err => {
				reject(new Error(Project.resourceName + ' ' + id + ' not found.'))
			})
		})
	}

	post(body) {
		return new Promise((resolve, reject) => {
			let payload = null
			body['dateString'] = vertex.utils.formattedDate()

			if (body.name != null)
				body['slug'] = vertex.utils.slugVersion(body.name, 6)

			Project.create(body)
			.then(project => {
				payload = project.summary()
				return (process.env.TURBO_ENV=='dev') ? null : Controller.syncCollection(Project.collectionName())
			})
			.then(data => {
				resolve(payload)
			})
			.catch(err => {
				reject(err)
			})
		})
	}

	put(id, params) {
		return new Promise((resolve, reject) => {
			let payload = null
			Project.findByIdAndUpdate(id, params, {new:true})
			.then(project => {
				payload = project.summary()
				return (process.env.TURBO_ENV=='dev') ? null : Controller.syncCollection(Project.collectionName())
			})
			.then(data => {
				resolve(payload)
			})
			.catch(err => {
				reject(err)
			})
		})
	}

	delete(id) {
		return new Promise((resolve, reject) => {
			Project.findByIdAndRemove(id)
			.then(() => {
				return (process.env.TURBO_ENV=='dev') ? null : Controller.syncCollection(Project.collectionName())
			})
			.then(data => {
				resolve()
			})
			.catch(err => {
				reject(err)
			})
		})
	}
}

module.exports = ProjectController
