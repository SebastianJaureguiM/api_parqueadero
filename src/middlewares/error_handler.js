const middleware = (error, req, res, next) => {
    let object_error = {
        name: 'Error',
        message: error.message,
        status: 400,
    }

    res.status(object_error.status).json(object_error)
};

module.exports = middleware