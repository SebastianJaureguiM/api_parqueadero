const { Router } = require("express")
const route = Router()
const user_dao = require("../data/dao/user.dao")
const {is_admin,is_partner,is_client,is_valid_admin_or_partner} = require("../middlewares/auth")

route.post("/createUserPartner", [is_admin], async function (req, res, next) {
    try {
        const user = req.body
        const response = await user_dao.create_user_partner(user)
        res.status(200).json({ 
            msg: "Usuario Creado",
            id: response.insertId
        })
    } catch (error) {
        next(error)
    }
})

route.post("/createUserClient", [is_valid_admin_or_partner], async function (req, res, next) {
    try {
        const user = req.body
        const response = await user_dao.create_user_client(user)
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

route.post("/associateClientToPartner", [is_admin], async function (req, res, next) {
    try {
        const data = req.body
        const response = await user_dao.associate_client_to_partner(data)
        res.status(200).json({ 
            msg: "Se ha asociado el cliete al socio correctamente",
            id: response.insertId
        })
    } catch (error) {
        next(error)
    }
})

route.post("/associateClientToPartnerHimself", [is_partner], async function (req, res, next) {
    try {
        const {idusuariocliente,idparqueadero_socio,estado} = req.body
        const {idusuariosocio} = req.body
        const data = {idusuariocliente,idparqueadero_socio,estado}

        const response = await user_dao.associate_client_to_partner_himself(data,idusuariosocio)
        res.status(200).json({ 
            msg: "Se ha asociado el cliete al socio correctamente",
            id: response.insertId
        })
    } catch (error) {
        next(error)
    }
})

route.get("/listClientsByPartner", [is_admin], async function (req, res, next) {
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

route.get("/checkVehiclesParkingFirstTimeNotByPartner", [is_partner], async function (req, res, next) {
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

route.get("/howMuchClientsUsedParking", [is_partner], async function (req, res, next) {
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