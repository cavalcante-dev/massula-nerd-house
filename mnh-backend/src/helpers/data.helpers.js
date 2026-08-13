const formatarParaExibicao = (date) => {
    if (!date) return null
    const d = new Date(date)
    const dia = String(d.getUTCDate()).padStart(2, '0')
    const mes = String(d.getUTCMonth() + 1).padStart(2, '0')
    const ano = d.getUTCFullYear()
    return `${dia}/${mes}/${ano}`
}

const formatarParaBanco = (dataString) => {
    if (!dataString) return null
    const [dia, mes, ano] = dataString.split('/')
    if (!dia || !mes || !ano) return null
    return `${ano}-${mes.padStart(2,'0')}-${dia.padStart(2,'0')}`
}

const converterParaDate = (dataString) => {
    if (!dataString) return null
    const [dia, mes, ano] = dataString.split('/')
    if (!dia || !mes || !ano) return null
    return new Date(Date.UTC(Number(ano), Number(mes) - 1, Number(dia)))
}

const validarData = (dataString) => {
    if (!dataString) return false
    const [dia, mes, ano] = dataString.split('/')
    if (!dia || !mes || !ano) return false

    const date = new Date(`${ano}-${mes}-${dia}`)
    return date instanceof Date && !isNaN(date)
}

const dataEhFutura = (dataString) => {
    if (!validarData(dataString)) return false
    return converterParaDate(dataString) > new Date()
}

const dataEhPassada = (dataString) => {
    if (!validarData(dataString)) return false
    return converterParaDate(dataString) < new Date()
}

const datasIguais = (dataStringA, dataStringB) => {
    if (!validarData(dataStringA) || !validarData(dataStringB)) return false
    return converterParaDate(dataStringA).toDateString() === converterParaDate(dataStringB).toDateString()
}

const hojeFormatado = () => {
    return new Date().toLocaleDateString('pt-BR')
}

module.exports = {
    formatarParaExibicao,
    formatarParaBanco,
    converterParaDate,
    validarData,
    dataEhFutura,
    dataEhPassada,
    datasIguais,
    hojeFormatado
}