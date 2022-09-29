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

route.get("/vehicleList", [], async function (req, res, next) {
    try {
        const response = await parking_dao.vehicle_list_in_parking()
        res.status(200).json({ 
            msg: "Listado de vehículos",
            data: response
        })
    } catch (error) {
        next(error)
    }
})

route.get("/mostRegisteredVehicles", [], async function (req, res, next) {
    try {
        const response = await parking_dao.most_registered_vehicles()
        res.status(200).json({ 
            msg: "10 vehículos que mas veces se han registrado en el parqueadero",
            data: response
        })
    } catch (error) {
        next(error)
    }
})

route.get("/checkVehiclesAllParkingFirstTimeNot", [], async function (req, res, next) {
    try {
        const response = await parking_dao.check_vehicles_parking_first_time_not()
        res.status(200).json({ 
            msg: "Listado de vehículos parqueados actualmente",
            data: response
        })
    } catch (error) {
        next(error)
    }
})

route.get("/usageParkingByDateByParking", [], async function (req, res, next) {
    try {
        const {idparqueadero,fecha_inicial,fecha_final} = req.body
        const response = await parking_dao.usage_parking_by_date_by_parking(idparqueadero,fecha_inicial,fecha_final)
        res.status(200).json({ 
            msg: "Promedio de uso de un parqueadero por rango de fecha",
            data: response
        })
    } catch (error) {
        next(error)
    }
})

route.get("/usageAllParkingByDate", [], async function (req, res, next) {
    try {
        const {fecha_inicial,fecha_final} = req.body
        const response = await parking_dao.usage_all_parking_by_date(fecha_inicial,fecha_final)
        res.status(200).json({ 
            msg: "Promedio de uso de todos los parqueaderos por un rango de fecha",
            data: response
        })
    } catch (error) {
        next(error)
    }
})

route.get("/timeUsageByVehicleParking", [], async function (req, res, next) {
    try {
        const {idparqueadero} = req.body
        const response = await parking_dao.time_usage_by_vehicle_parking(idparqueadero)
        res.status(200).json({ 
            msg: "Promedio de tiempo que están los vehículos en un parqueadero",
            data: response
        })
    } catch (error) {
        next(error)
    }
})

module.exports = route