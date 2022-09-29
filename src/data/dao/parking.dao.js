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

        const vehicleInParking = await pool.query(`SELECT * 
        FROM vehiculo_parqueadero vp 
        INNER JOIN parqueadero p ON p.idparqueadero=vp.idparqueadero
        WHERE vp.idvehiculo = ? AND vp.fecha_salida IS NULL`, [vehicleData[0]['idvehiculo']])
        if(vehicleInParking.length)
            throw new Error("No se puede Registrar Ingreso, ya existe la placa")

        if(vehicleInParking.length >= vehicleInParking[0]['cantidad_maxima'])
            throw new Error("No se puede Registrar Ingreso, cantidad maxima parqueadero alcanzada")

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

const vehicle_list_in_parking = async () => {
    try {
        const vehiclesInParking = await pool.query("SELECT * FROM vehiculo_parqueadero vp INNER JOIN vehiculo v ON v.idvehiculo=vp.idvehiculo INNER JOIN parqueadero p ON p.idparqueadero=vp.idparqueadero INNER JOIN usuario u ON u.idusuario=v.propietario WHERE vp.fecha_salida IS null")
        if(!vehiclesInParking.length)
            throw new Error("No hay ningun vehiculo en los parqueaderos")
        
        let data = []

        vehiclesInParking.forEach(element => {
            let row = {
                id: element.idvehiculo_parqueadero,
                placa: element.placa,
                fechaIngreso: moment(element.fecha_ingreso).format('YYYY-MM-DD HH:mm:ss'),
                socio: {
                    idusuario: element.idusuario,
                    nombre: element.nombre + " " + element.apellido,
                    email: element.email
                }
            }
            data.push(row) 
        })

        return data
    } catch (error) {
        if(error.message)
            throw new Error(error.message)
    }
}

const most_registered_vehicles = async () => {
    try {
        const mostRegistedesVehicles = await pool.query("SELECT v.placa, COUNT(v.placa) AS cantidad_ingresos FROM vehiculo_parqueadero vp INNER JOIN vehiculo v ON v.idvehiculo=vp.idvehiculo GROUP BY v.placa ORDER BY cantidad_ingresos DESC LIMIT 10")
        if(!mostRegistedesVehicles.length)
            throw new Error("No se ha registrado ningun vehiculo en los parqueaderos")
        
        return mostRegistedesVehicles
    } catch (error) {
        if(error.message)
            throw new Error(error.message)
    }
}

const parking_vehicle_history = async (idparqueadero,placa,fecha_inicial,fecha_final) => {
    try {
        let query = `SELECT * FROM vehiculo_parqueadero vp INNER JOIN vehiculo v ON v.idvehiculo=vp.idvehiculo WHERE (vp.fecha_ingreso BETWEEN ? AND ?) `
        let params = [fecha_inicial,fecha_final]
        if (idparqueadero) {
            query += `AND vp.idparqueadero = ? `
            params.push(idparqueadero)
        }

        if (placa) {
            query += `AND v.placa LIKE ?`
            params.push(`%${placa}%`)
        }

        const vehicleHistory = await pool.query(query,params)

        if(!vehicleHistory.length)
            return []

        let data = []
        vehicleHistory.forEach(element => {
            let row = {
                idregistro_parqueadero: element.idvehiculo_parqueadero,
                placa: element.placa,
                modelo: element.modelo,
                propietario: element.propietario,
                fechaIngreso: moment(element.fecha_ingreso).format('YYYY-MM-DD HH:mm:ss'),
                idparqueadero: element.idparqueadero,
                idvehiculo:element.idvehiculo
            }
            data.push(row) 
        });    

        return data
    } catch (error) {
        if(error.message)
            throw new Error(error.message)
    }
}

const check_vehicles_parking_first_time_not = async () => {
    try {
        const checkVehiclesParkingFirstTimeNot = await pool.query(`SELECT v.placa,vp.idvehiculo_parqueadero,
                                                                    @cantidad_ingresos := (SELECT COUNT(*) FROM vehiculo_parqueadero WHERE idvehiculo=vp.idvehiculo) AS cantidad_ingresos,
                                                                    CASE WHEN @cantidad_ingresos>1 THEN 0 WHEN @cantidad_ingresos=1 THEN 1 END AS vehiculo_nuevo_parqueadero
                                                                    FROM vehiculo_parqueadero vp 
                                                                    INNER JOIN vehiculo v ON v.idvehiculo=vp.idvehiculo 
                                                                    GROUP BY v.placa`)
        if(!checkVehiclesParkingFirstTimeNot.length)
            throw new Error("No se ha registrado ningun vehiculo en los parqueaderos")
        
        return checkVehiclesParkingFirstTimeNot
    } catch (error) {
        if(error.message)
            throw new Error(error.message)
    }
}

const usage_parking_by_date_by_parking = async (idparqueadero,fecha_inicial,fecha_final) => {
    try {
        const usageParkingCheckout = await pool.query(`SELECT vp.*
            FROM parqueadero p 
            INNER JOIN vehiculo_parqueadero vp ON vp.idparqueadero=p.idparqueadero
            WHERE p.idparqueadero = ? AND vp.fecha_salida BETWEEN ? AND ?`,[idparqueadero,fecha_inicial,fecha_final])

        let sumatoria = 0  
        usageParkingCheckout.forEach(element => {
            const fecha_ingreso = moment(element.fecha_ingreso)
            const fecha_salida = moment(element.fecha_salida)
            sumatoria += fecha_salida.diff(fecha_ingreso, 'hours')
        })

        let promedio = 0
        if (usageParkingCheckout.length)
            promedio = sumatoria/usageParkingCheckout.length
        
        return {
            promedio_uso_horas: promedio
        }
    } catch (error) {
        if(error.message)
            throw new Error(error.message)
    }
}

const usage_all_parking_by_date = async (fecha_inicial,fecha_final) => {
    try {
        const usageParkingCheckout = await pool.query(`SELECT *
            FROM vehiculo_parqueadero vp
            WHERE vp.fecha_salida BETWEEN ? AND ?`,[fecha_inicial,fecha_final])
        
        let sumatoria = 0  
        usageParkingCheckout.forEach(element => {
            const fecha_ingreso = moment(element.fecha_ingreso)
            const fecha_salida = moment(element.fecha_salida)
            sumatoria += fecha_salida.diff(fecha_ingreso, 'hours')
        })

        let promedio = 0
        if (usageParkingCheckout.length)
            promedio = sumatoria/usageParkingCheckout.length

        return {
            promedio_uso_horas: promedio
        }
    } catch (error) {
        if(error.message)
            throw new Error(error.message)
    }
}

const time_usage_by_vehicle_parking = async (idparqueadero) => {
    try {
        const timeUsageByVehicleParking = await pool.query(`SELECT vp.*,v.*
                FROM parqueadero p 
                INNER JOIN vehiculo_parqueadero vp ON vp.idparqueadero=p.idparqueadero
                INNER JOIN vehiculo v ON v.idvehiculo=vp.idvehiculo
                WHERE p.idparqueadero = ? AND vp.fecha_salida IS NOT NULL`,[idparqueadero])
        let sumatoria = 0        
        timeUsageByVehicleParking.forEach(element => {
            const fecha_ingreso = moment(element.fecha_ingreso)
            const fecha_salida = moment(element.fecha_salida)
            sumatoria += fecha_salida.diff(fecha_ingreso, 'hours')
        })

        let promedio = 0
        if (timeUsageByVehicleParking.length)
            promedio = sumatoria/timeUsageByVehicleParking.length

        return {
            promedio_uso_horas: promedio
        }
    } catch (error) {
        if(error.message)
            throw new Error(error.message)
    }
}

module.exports = {
    create_parking,
    register_vehicle_income,
    register_vehicle_check_out,
    vehicle_list_in_parking,
    most_registered_vehicles,
    check_vehicles_parking_first_time_not,
    usage_parking_by_date_by_parking,
    usage_all_parking_by_date,
    time_usage_by_vehicle_parking,
    parking_vehicle_history
}