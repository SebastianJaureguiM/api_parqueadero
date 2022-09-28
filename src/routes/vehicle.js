const { Router } = require("express")
const route = Router()
const vehicle_dao = require("../data/dao/vehicle.dao")

route.post("/", [], async function (req, res, next) {
    try {
        const vehicle = req.body
        const response = await vehicle_dao.create_vehicle(vehicle)
        res.status(200).json({ 
            msg: "Vehiculo Creado",
            id: response.insertId
        })

    } catch (error) {
        next(error)
    }
})

route.get("/getDataListOfVehiclesByClient", [], async function (req, res, next) {
    try {
        let {propietario} = req.body
        const response = await vehicle_dao.get__data_list_vehicles_by_client(propietario)
        res.status(200).json({ 
            msg: `Listado y detalle de vehículos del cliente N. ${propietario}`,
            data: response
        })
    } catch (error) {
        next(error)
    }
})


module.exports = route