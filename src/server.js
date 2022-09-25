const express = require("express")
const cors = require("cors")
const paths = require("./routes/index.routes")
const body_parser = require('body-parser')
const error_handler = require('./middlewares/error_handler')
const config = require('./config')

class Server {
    constructor() {
        this.app = express()

        this.paths = paths

        this.middleware()

        this.routes()

        this.errors()

        this._404_response()

        this.port = config.API_PARKING.PORT
    }

    routes() {
        const context = config.API_PARKING.CONTEXT
        for (const route in paths) {
            if (Object.hasOwnProperty.call(paths, route)) {
                this.app.use(context + this.paths[route], require(`./routes/${route}`))
            }
        }
    }

    middleware() {
        this.app.use(cors())

        this.app.use(body_parser.json({
            limit: "50mb",
        }))
        this.app.use(body_parser.urlencoded({
            limit: "50mb",
            extended: true,
        }))
    }

    errors() {
        this.app.use(error_handler)
    }

    _404_response() {
        this.app.get('*', function (req, res) {
            res.status(404).send({ status: 404, message: "Not found" })
        })
    }

    listen() {
        this.app.listen(this.port, console.log(`Listening on port ${this.port}`))
    }
}

module.exports = Server