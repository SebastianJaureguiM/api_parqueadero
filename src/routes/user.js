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

        await user_dao.login_user(user.email,user.clave)
        res.status(200).json({ 
            msg: "Usuario inicio sesion"
        })
 
    } catch (error) {
        next(error)
    }
})



module.exports = route