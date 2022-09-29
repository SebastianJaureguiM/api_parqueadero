const pool = require("../connection")
const user_service = require("../../services/user_service")

const create_user = async (user) => {
    try {
        if (JSON.stringify(user) === '{}') {
            throw new Error("Datos vacios")
        }    
        return await pool.query("INSERT INTO usuario SET ?", user)
    } catch (error) {
        if (error.errno == 1062 || error.code == 'ER_DUP_ENTRY') 
            throw new Error(error.sqlMessage)
        else
            throw new Error(error.message)
    }
}

const login_user = async (email,clave) => {
    try { 
        const user = await pool.query("SELECT clave,idrol FROM usuario WHERE email=? AND estado=?", [email,1])
        if (!user.length) {
            throw new Error("El usuario no existe o esta desactivado")
        }

        if (user[0]['clave'] != clave) {
            throw new Error("Credenciales incorrectas")
        }
        
        const token = await user_service.login_user(user[0]['idrol'])
        return token;
    } catch (error) {
        if (error.message) 
            throw new Error(error.message)
    }   
}

const list_clients_by_partner = async () => {
    try {
        const listClientsByPartner = await pool.query(`SELECT concat(u.nombre, ' ', u.apellido) as nombre_socio,
                                                        (    
                                                            SELECT COUNT(*) 
                                                            FROM cliente_socio_parqueadero csp 
                                                            WHERE ps.idparqueadero_socio=csp.idparqueadero_socio AND csp.estado=1
                                                        ) AS cantidad_clientes
                                                        FROM parqueadero_socio ps 
                                                        INNER JOIN usuario u ON u.idusuario=ps.idusuariosocio
                                                        WHERE ps.estado = 1`)
        if(!listClientsByPartner.length)
            throw new Error("No existe ningun cliente por socio")
        
        return listClientsByPartner
    } catch (error) {
        if(error.message)
            throw new Error(error.message)
    }
}

const check_vehicles_parking_first_time_not_by_parnet = async (idsocio) => {
    try {
        const checkVehiclesParkingFirstTimeNotByPartner = await pool.query(`SELECT v.placa,vp.idvehiculo_parqueadero,
                                                                    @cantidad_ingresos := (SELECT COUNT(*) FROM vehiculo_parqueadero WHERE idvehiculo=vp.idvehiculo) AS cantidad_ingresos,
                                                                    CASE WHEN @cantidad_ingresos>1 THEN 0 WHEN @cantidad_ingresos=1 THEN 1 END AS vehiculo_nuevo_parqueadero
                                                                    FROM vehiculo_parqueadero vp 
                                                                    INNER JOIN vehiculo v ON v.idvehiculo=vp.idvehiculo
                                                                    INNER JOIN parqueadero p ON p.idparqueadero=vp.idparqueadero
                                                                    INNER JOIN parqueadero_socio ps ON ps.idparqueadero=p.idparqueadero
                                                                    WHERE ps.idusuariosocio = ? AND ps.estado = 1 
                                                                    GROUP BY v.placa`,[idsocio])
        if(!checkVehiclesParkingFirstTimeNotByPartner.length)
            throw new Error(`No se ha registrado ningun vehiculo en los parqueaderosdel socio N. ${idsocio}`)
        
        return checkVehiclesParkingFirstTimeNotByPartner
    } catch (error) {
        if(error.message)
            throw new Error(error.message)
    }
}

const how_much_clients_used_parking = async (idsocio) => {
    try {
        const howMuchClientsUsedParking = await pool.query(`SELECT u.idusuario
                            FROM parqueadero_socio ps
                            INNER JOIN cliente_socio_parqueadero csp ON csp.idparqueadero_socio=ps.idparqueadero_socio
                            INNER JOIN usuario u ON u.idusuario=csp.idusuariocliente
                            INNER JOIN vehiculo v ON v.propietario=u.idusuario
                            INNER JOIN vehiculo_parqueadero vp ON vp.idvehiculo=v.idvehiculo
                            WHERE ps.idusuariosocio = ?
                            GROUP BY vp.idvehiculo`,[idsocio])

        const howClientsNotUsedParking = await pool.query(`SELECT u.idusuario,concat(u.nombre, ' ', u.apellido) as nombre_cliente,u.email,v.idvehiculo,v.placa
                            FROM parqueadero_socio ps
                            INNER JOIN cliente_socio_parqueadero csp ON csp.idparqueadero_socio=ps.idparqueadero_socio
                            INNER JOIN usuario u ON u.idusuario=csp.idusuariocliente
                            INNER JOIN vehiculo v ON v.propietario=u.idusuario
                            LEFT JOIN vehiculo_parqueadero vp ON vp.idvehiculo=v.idvehiculo
                            WHERE ps.idusuariosocio = ? AND csp.estado = 1 AND vp.fecha_ingreso IS null`,[idsocio])
        let clientes_no_han_usado_parqueadero = []
        howClientsNotUsedParking.forEach(element => {
            clientes_no_han_usado_parqueadero.push(element)
        });
        
        let data = {
            cantidad_clientes : howMuchClientsUsedParking.length,
            clientes_no_han_usado_parqueadero : clientes_no_han_usado_parqueadero
        }

        return data
    } catch (error) {
        if(error.message)
            throw new Error(error.message)
    }
}

module.exports = {
    create_user,
    login_user,
    list_clients_by_partner,
    check_vehicles_parking_first_time_not_by_parnet,
    how_much_clients_used_parking
}