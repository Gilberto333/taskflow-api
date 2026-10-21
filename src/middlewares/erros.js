function erros(err, req, res, next) {
    console.error("\n========== ERRO ==========")
    console.error("Data:", new Date().toLocaleString())
    console.error("Método:", req.method)
    console.error("Rota:", req.originalUrl)
    console.error("Mensagem:", err.message)
    console.error("Status:", err.status || 500)

    if (process.env.NODE_ENV !== "production") {
        console.error(err.stack)
    }

    console.error("==========================\n")

    res.status(err.status || 500).json({
        sucesso: false,
        mensagem: err.message || "Erro interno do servidor"
    })
}

module.exports = erros