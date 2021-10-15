
const errorHandler = (err, req, res, next) => {
    console.error("entrou na funcao de tratamento de erros");
    return res.status(501).json({
        success: false,
        msg: 'Something broke!' + err.message
    });
}


module.exports = errorHandler;