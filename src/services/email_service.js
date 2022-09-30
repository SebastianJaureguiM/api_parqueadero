const axios = require('axios')

const send_email = async (email,placa,mensaje,socio) => {
    return await axios.post(process.env.URL_API_CORREOS, {
        email,
        placa,
        mensaje,
        socio
    });

}

module.exports = {
    send_email
}