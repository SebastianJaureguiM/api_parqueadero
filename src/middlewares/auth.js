const user_service = require("../services/user_service")

const error_auth = {
    name: 'Error Autorizacion',
    status: 401,
    message: 'No estas autorizado para ingresar',
}

const is_admin = (req, res, next) => {
    const header_auth = req.headers.authorization
    if (!header_auth) 
        return error_auth
    
    const header_split = header_auth.split(' ')
    const token = header_split[1]

    const is_valid_user = user_service.is_valid_admin(token)
    if (!is_valid_user) 
        return error_auth
    
    next()
}

const is_partner = (req, res, next) => {
    const header_auth = req.headers.authorization
    if (!header_auth) 
        return error_auth
    
    const header_split = header_auth.split(' ')
    const token = header_split[1]

    const is_valid_user = user_service.is_valid_partner(token)
    if (!is_valid_user) 
        return error_auth
    
    next()
}

const is_client = (req, res, next) => {
    const header_auth = req.headers.authorization
    if (!header_auth) 
        return error_auth
    
    const header_split = header_auth.split(' ')
    const token = header_split[1]

    const is_valid_user = user_service.is_valid_client(token)
    if (!is_valid_user) 
        return error_auth
    
    next()
}

module.exports = {
    is_admin,
    is_partner,
    is_client
}