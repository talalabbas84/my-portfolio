/*
  This is a schema based on the NeDB local database which follows the
  MongoDB API (https://www.npmjs.com/package/nedb). The 'camo' library
  is an ORM for the NeDB implementation.

  Eventually, this should be replaced by a MONGOOSE schema when used in
  conjunction with Mongo DB. This would happen in the case of a
  developer taking over the project.
*/

// https://github.com/scottwrobinson/camo
const Document = require('vertex-camo').Document
const props = {
  image: {type:String, default:''},
  name: {type:String, default:'', trim:true, display:true},
  category: {type:String, default:''},
	slug: {type:String, default:'', immutable:true},
  preview: {type:String, default:''},
  link: {type:String, default:''},
  client: {type:String, default:''},
  dateRange: {type:String, default:''},
  description: {type:String, default:'', isHtml:true},
	schema: {type:String, default:'project', immutable:true},
	dateString: {type:String, default:'', immutable:true},
	timestamp: {type:Date, default: new Date(), immutable:true}
}

class Project extends Document {
	constructor(){
		super()
		this.schema(props)

		// this is how to set default values on new instances
		this.timestamp = new Date()
	}

	static get resourceName(){
		return 'project'
	}

	static collectionName(){
			return 'projects'
	}
}

module.exports = Project
