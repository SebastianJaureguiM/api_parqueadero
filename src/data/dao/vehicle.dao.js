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

const get__data_list_vehicles_by_client = async (propietario) => {
    try {
        const getDataListOfVehiclesByClient = await pool.query(`SELECT u.idusuario,concat(u.nombre, ' ', u.apellido) as nombre_cliente,u.email,u.idusuario,v.placa,v.modelo 
                                                FROM vehiculo v 
                                                INNER JOIN usuario u ON u.idusuario=v.propietario
                                                WHERE v.propietario = ?`,[propietario])
        if(!getDataListOfVehiclesByClient.length)
            throw new Error(`El cliente N. ${propietario} no cuenta con ningun vehiculo`)
        
        return getDataListOfVehiclesByClient
    } catch (error) {
        if(error.message)
            throw new Error(error.message)
    }
}

module.exports = {
    create_vehicle,
    get__data_list_vehicles_by_client,
}