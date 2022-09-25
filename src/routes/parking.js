const { Router } = require("express")
const route = Router()
const pool = require("../data/connection")

route.get("/test", [], function (req, res, next) {
    try {
        console.log("Endpoint test")
        res.status(200).json({ msg: "Endpoint test" })
    } catch (error) {
        next(error)
    }
})



module.exports = route