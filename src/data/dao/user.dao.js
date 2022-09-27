const pool = require("../connection")

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
        const user = await pool.query("SELECT clave FROM usuario WHERE email=? AND estado=?", [email,1])
        if (!user.length) {
            throw new Error("El usuario no existe o esta desactivado")
        }

        if (user[0]['clave'] != clave) {
            throw new Error("Credenciales incorrectas")
        }
        
        return true;
    } catch (error) {
        if (error.message) 
            throw new Error(error.message)
    }
    
}

module.exports = {
    create_user,
    login_user
}