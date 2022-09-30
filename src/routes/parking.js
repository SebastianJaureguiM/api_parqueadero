const { Router } = require("express")
const route = Router()
const parking_dao = require("../data/dao/parking.dao")
const email_service = require("../services/email_service")
const {is_admin,is_partner,is_client,is_valid_admin_or_partner,is_valid_user} = require("../middlewares/auth")

route.post("/", [is_admin], async function (req, res, next) {
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

route.put("/updateParking", [is_admin], async function (req, res, next) {
    try {
        const {nombre,cantidad_maxima,estado} = req.body
        const {idparqueadero} = req.body
        const dataUpdtateParking = {nombre,cantidad_maxima,estado}
        const response = await parking_dao.update_parking(dataUpdtateParking,idparqueadero)
        res.status(200).json({ 
            msg: "Parqueadero Actualizado"
        })
    } catch (error) {
        next(error)
    }
})

route.put("/inactiveParking", [is_admin], async function (req, res, next) {
    try {
        const {idparqueadero} = req.body
        const response = await parking_dao.inactive_parking(idparqueadero)
        res.status(200).json({ 
            msg: "Parqueadero Inactivado Correctamente"
        })
    } catch (error) {
        next(error)
    }
})

route.get("/allParkingList", [is_admin], async function (req, res, next) {
    try {
        const response = await parking_dao.all_parking_list()
        res.status(200).json({ 
            msg: "Listado de parqueaderos",
            data: response
        })
    } catch (error) {
        next(error)
    }
})

route.get("/parkingById", [is_admin], async function (req, res, next) {
    try {
        const {idparqueadero} = req.body
        const response = await parking_dao.parking_by_id(idparqueadero)
        res.status(200).json({ 
            msg: `Parqueadero ${idparqueadero}`,
            data: response
        })
    } catch (error) {
        next(error)
    }
})

route.post("/associateParkingToPartner", [is_admin], async function (req, res, next) {
    try {
        const data = req.body
        const response = await parking_dao.associate_parking_to_partner(data)
        res.status(200).json({ 
            msg: `Asociado el Socio ${data.idusuariosocio} al Parqueadero ${data.idparqueadero}`,
            id: response.insertId
        })
    } catch (error) {
        next(error)
    }
})

route.post("/registerIncome", [is_client], async function (req, res, next) {
    try {
        const vehiculeIncome = req.body
        const response = await parking_dao.register_vehicle_income(vehiculeIncome)
        const response_send_email = await email_service.send_email(response.email,vehiculeIncome.placa,`El vehiculo con placa ${vehiculeIncome.placa} ha ingresado al parqueadero ${response.parqueadero}`,response.socio)
        res.status(201).json({ 
            id: response.response.insertId,
            msg: "Ingreso del vehiculo correcto",
            msg_send_email: response_send_email.data.msg
        })
    } catch (error) {
        next(error)
    }
})

route.post("/checkOut", [is_client], async function (req, res, next) {
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

route.get("/vehicleList", [is_valid_user], async function (req, res, next) {
    try {
        const {idusuariosocio} = req.body
        const response = await parking_dao.vehicle_list_in_parking(idusuariosocio)
        res.status(200).json({ 
            msg: response.msg,
            data: response.data
        })
    } catch (error) {
        next(error)
    }
})

route.get("/mostRegisteredVehicles", [is_valid_admin_or_partner], async function (req, res, next) {
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

route.get("/parkingVehicleHistory", [is_admin], async function (req, res, next) {
    try {
        const {idparqueadero,placa,fecha_inicial,fecha_final} = req.body
        const response = await parking_dao.parking_vehicle_history(idparqueadero,placa,fecha_inicial,fecha_final)
        res.status(200).json({ 
            msg: "Historial de vehiculos",
            data: response
        })
    } catch (error) {
        next(error)
    }
})

route.get("/checkVehiclesAllParkingFirstTimeNot", [is_partner], async function (req, res, next) {
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

route.get("/usageParkingByDateByParking", [is_partner], async function (req, res, next) {
    try {
        const {idparqueadero,fecha_inicial,fecha_final} = req.body
        const response = await parking_dao.usage_parking_by_date_by_parking(idparqueadero,fecha_inicial,fecha_final)
        res.status(200).json({ 
            msg: `Promedio de tiempo de uso del parqueadero ${idparqueadero} entre las fechas ${fecha_inicial} y ${fecha_final}`,
            data: response
        })
    } catch (error) {
        next(error)
    }
})

route.get("/usageAllParkingByDate", [is_partner], async function (req, res, next) {
    try {
        const {fecha_inicial,fecha_final} = req.body
        const response = await parking_dao.usage_all_parking_by_date(fecha_inicial,fecha_final)
        res.status(200).json({ 
            msg: `Promedio de tiempo de uso de todos los parqueaderos entre las fechas ${fecha_inicial} y ${fecha_final}`,
            data: response
        })
    } catch (error) {
        next(error)
    }
})

route.get("/timeUsageByVehicleParking", [is_partner], async function (req, res, next) {
    try {
        const {idparqueadero} = req.body
        const response = await parking_dao.time_usage_by_vehicle_parking(idparqueadero)
        res.status(200).json({ 
            msg: `Promedio de tiempo que están los vehículos en el parqueadero ${idparqueadero}`,
            data: response
        })
    } catch (error) {
        next(error)
    }
})

module.exports = route