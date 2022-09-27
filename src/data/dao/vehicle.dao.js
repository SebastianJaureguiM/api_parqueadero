const pool = require("../connection")

const create_vehicle = async (vehicle) => {
    try {
        if (JSON.stringify(vehicle) === '{}') {
            throw new Error("Datos vacios")
        }  

        let validFormat = /[a-z]{1}[a-z]{1}[a-z]{1}[0-9]{1}[0-9]{1}[0-9]{1}/;
        if(!validFormat.test(vehicle.placa) || vehicle.placa.length>6){
            throw new Error("Caracteres invalidos o longitud invalida de la placa")
        }

        return await pool.query("INSERT INTO vehiculo SET ?", vehicle)
    } catch (error) {
        if (error.errno == 1062 || error.code == 'ER_DUP_ENTRY') 
            throw new Error(error.sqlMessage)
        else
            throw new Error(error.message)
    }
    
}

module.exports = {
    create_vehicle,
}