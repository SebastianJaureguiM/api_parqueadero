const njwt_service = require("./njwt_service")

const PARKING_ROLES = {
    admin_role: "1",
    partner_role: "2", 
    client_role: "3"
}

const login_user = async (idrol) => {
    return njwt_service.create_token({ idrol })
}

const is_valid_admin = (token) => {
    let valid_user = false
    let data = njwt_service.decode_token(token)
    if (data.idrol == PARKING_ROLES.admin_role) 
        valid_user = true
    
    return valid_user
}

const is_valid_partner = (token) => {
    let valid_user = false
    let data = njwt_service.decode_token(token)
    if (data.idrol == PARKING_ROLES.partner_role) {
        valid_user = true
    }
    return valid_user
}

const is_valid_client = (token) => {
    let valid_user = false
    let data = njwt_service.decode_token(token)
    if (data.idrol == PARKING_ROLES.client_role) {
        valid_user = true
    }
    return valid_user
}

module.exports = {
    PARKING_ROLES,
    login_user,
    is_valid_admin,
    is_valid_partner,
    is_valid_client
}