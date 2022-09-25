const middleware = (error, req, res, next) => {
    let error = {
        name: 'Error',
        message: error.message,
        status: 400,
    }

    res.status(error.status).json(error)
};

module.exports = middleware