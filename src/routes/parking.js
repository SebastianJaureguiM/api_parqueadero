const { Router } = require("express")
const route = Router()
const parking_dao = require("../data/dao/parking.dao")

route.post("/", [], async function (req, res, next) {
    try {
        const parking = req.body
        const response = await parking_dao.create_parking(parking)
        res.status(200).json({ 
            msg: "Parqueadero Creado",
            id: response.insertId
        })
    } catch (error) {
        next(error)
    }
})

route.post("/registerIncome", [], async function (req, res, next) {
    try {
        const vehiculeIncome = req.body
        const response = await parking_dao.register_vehicle_income(vehiculeIncome)
        res.status(201).json({ 
            id: response.insertId,
            msg: "Ingreso del vehiculo correcto"
        })
    } catch (error) {
        next(error)
    }
})

route.post("/checkOut", [], async function (req, res, next) {
    try {
        const vehiculeCheckOut = req.body
        await parking_dao.register_vehicle_check_out(vehiculeCheckOut)
        res.status(200).json({ 
            msg: "Salida registrada"
        })
    } catch (error) {
        next(error)
    }
})

module.exports = route