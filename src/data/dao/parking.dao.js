const pool = require("../connection")
const moment = require("moment")

const create_parking = async (parking) => {
    try {
        if (JSON.stringify(parking) === '{}') {
            throw new Error("Datos vacios")
        }  
        return await pool.query("INSERT INTO parqueadero SET ?", parking)
    } catch (error) {
        if(error.message)
            throw new Error(error.message)
    }
}

const register_vehicle_income = async (vehicle_income) => {
    try {
        if (JSON.stringify(vehicle_income) === '{}') {
            throw new Error("Datos vacios")
        } 

        const vehicleData = await pool.query("SELECT idvehiculo,propietario FROM vehiculo WHERE placa LIKE ?", [vehicle_income.placa])

        const vehicleInParking = await pool.query("SELECT * FROM vehiculo_parqueadero WHERE idvehiculo = ? AND fecha_salida IS NULL", [vehicleData[0]['idvehiculo']])
        if(vehicleInParking.length)
            throw new Error("No se puede Registrar Ingreso, ya existe la placa")

        const vehicule = {
            "idparqueadero":vehicle_income.idparqueadero,
            "idvehiculo":vehicleData[0]['idvehiculo'],
            "fecha_ingreso":moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        }
        return await pool.query("INSERT INTO vehiculo_parqueadero SET ?", vehicule)
    } catch (error) {
        if(error.message)
            throw new Error(error.message)
    }
}

const register_vehicle_check_out = async (vehicle_check_out) => {
    try {
        if (JSON.stringify(vehicle_check_out) === '{}') {
            throw new Error("Datos vacios")
        } 

        const vehicleData = await pool.query("SELECT idvehiculo,propietario FROM vehiculo WHERE placa LIKE ?", [vehicle_check_out.placa])
        if(!vehicleData.length)
            throw new Error("No se puede Registrar Salida, no existe la placa")

        const vehicleInParking = await pool.query("SELECT * FROM vehiculo_parqueadero WHERE idvehiculo = ? AND fecha_salida IS NULL", [vehicleData[0]['idvehiculo']])
        if(!vehicleInParking.length)
            throw new Error("No se puede Registrar Salida, no se ha realizado ingreso")

        const vehiculeCheckOut = {
            "fecha_salida":moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        }
        return await pool.query("UPDATE vehiculo_parqueadero SET ? WHERE idvehiculo_parqueadero = ?", [vehiculeCheckOut, vehicleInParking[0]['idvehiculo_parqueadero']])
    } catch (error) {
        if(error.message)
            throw new Error(error.message)
    }
}

module.exports = {
    create_parking,
    register_vehicle_income,
    register_vehicle_check_out
}