const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})
const Controller = vertex.Controller
const Subscriber = require('../models/Subscriber')

class SubscriberController extends Controller {
	constructor(){
		super(Subscriber, process.env)
	}

	get(params) {
		return new Promise((resolve, reject) => {
			Controller.checkCollectionDB(Subscriber.collectionName())
			.then(data => {
				return Subscriber.find(params, Controller.parseFilters(params))
			})
			.then(subscribers => {
				resolve(Subscriber.convertToJson(subscribers))
			})
			.catch(err => {
				reject(err)
			})
		})
	}

	getById(id) {
		return new Promise((resolve, reject) => {
			Controller.checkCollectionDB(Subscriber.collectionName())
			.then(data => {
				return Subscriber.findById(id)
			})
			.then(subscriber => {
				if (subscriber == null){
					throw new Error(Subscriber.resourceName + ' ' + id + ' not found.')
					return
				}

				resolve(subscriber.summary())
			})
			.catch(err => {
				reject(new Error(Subscriber.resourceName + ' ' + id + ' not found.'))
			})
		})
	}

	post(body) {
		return new Promise((resolve, reject) => {
			let payload = null
			Subscriber.create(body)
			.then(subscriber => {
				payload = subscriber.summary()
				return (process.env.TURBO_ENV=='dev') ? null : Controller.syncCollection(Subscriber.collectionName())
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
			Subscriber.findByIdAndUpdate(id, params, {new:true})
			.then(subscriber => {
				payload = subscriber.summary()
				return (process.env.TURBO_ENV=='dev') ? null : Controller.syncCollection(Subscriber.collectionName())
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
			Subscriber.findByIdAndRemove(id)
			.then(() => {
				return (process.env.TURBO_ENV=='dev') ? null : Controller.syncCollection(Subscriber.collectionName())
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

module.exports = SubscriberController

