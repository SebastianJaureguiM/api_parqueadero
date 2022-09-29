const njwt = require('njwt')
const moment = require("moment")
const moment_timezone = require("moment-timezone")

const token_time = 6

const create_token = (data) => {
    try {
        const datos_cargar = {
            data
        }
        const json_token = njwt.create(datos_cargar,process.env.SECRECT_KEY_TOKEN)
        const token_expire_date = time_token_expire(token_time,'hours')
        if (!isValid(token_expire_date)) {
            throw new Error("Invalid Expiration Date")
        }
        json_token.setExpiration(token_expire_date)
        const token = json_token.compact()
        return token
    } catch (error) {
        console.log(error)
    }
}

const decode_token = (token) => {
    let data_token = {}
    try {
        const verified_token = njwt.verify(token, process.env.SECRECT_KEY_TOKEN)
        data_token = verified_token.body.data
        return data_token
    } catch (error) {
        console.log(error)
    } 
}

const time_token_expire = (time_expire, type_time) => {
    try {
        let timezone_colombia = moment_timezone.tz("America/Bogota")
        timezone_colombia.format("YYYY-MM-DD HH:mm:ss").toString()

        let now = moment(timezone_colombia)
        let token_expire_in = now.add(time_expire,type_time)
        return token_expire_in.toDate()
    } catch (error) {
        console.log(error)
    }
}

const isValid = (moment_string) => {
    try {
        return moment(moment_string).isValid()
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    create_token,
    decode_token
}