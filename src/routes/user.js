const { Router } = require("express")
const route = Router()
const user_dao = require("../data/dao/user.dao")

route.post("/", [], async function (req, res, next) {
    try {
        const user = req.body
        const response = await user_dao.create_user(user)

        res.status(200).json({ 
            msg: "Usuario Creado",
            id: response.insertId
        })
 
    } catch (error) {
        next(error)
    }
})

route.post("/login", [], async function (req, res, next) {
    try {
        const user = req.body
        if (!user.email || !user.clave) {
            throw new Error("Debe indicar el usuario y la contraseña")
        }

        const token = await user_dao.login_user(user.email,user.clave)
        res.status(200).json({ 
            msg: "Usuario inicio sesion",
            token
        })
 
    } catch (error) {
        next(error)
    }
})

route.get("/listClientsByPartner", [], async function (req, res, next) {
    try {
        const response = await user_dao.list_clients_by_partner()
        res.status(200).json({ 
            msg: "Listado de clientes por socio",
            data: response
        })
    } catch (error) {
        next(error)
    }
})

route.get("/checkVehiclesParkingFirstTimeNotByPartner", [], async function (req, res, next) {
    try {
        let {idsocio} = req.body
        const response = await user_dao.check_vehicles_parking_first_time_not_by_parnet(idsocio)
        res.status(200).json({ 
            msg: `Listado de vehículos parqueados actualmente en el parqueadero del socio N. ${idsocio}`,
            data: response
        })
    } catch (error) {
        next(error)
    }
})

route.get("/howMuchClientsUsedParking", [], async function (req, res, next) {
    try {
        let {idsocio} = req.body
        const response = await user_dao.how_much_clients_used_parking(idsocio)
        res.status(200).json({ 
            msg: `Cantidad clientes han usado y cuales no el parqueadero del socio N. ${idsocio}`,
            data: response
        })
    } catch (error) {
        next(error)
    }
})

module.exports = route