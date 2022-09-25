module.exports = {
    API_PARKING: {
        CONTEXT: "/api",
        PORT: process.env.PORT || 3000,
        DATABASE: {
            host: process.env.HOST_DB,
            user: process.env.USER_DB,
            password: process.env.PASS_DB,
            database: process.env.NAME_DB,
        }
    }
}