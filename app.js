class Despesa{
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }
    validarDados() {
        for(let i in this){
           if(this[i] == undefined || this[i] == '' || this[i] == null){
            return false
           }
        }
        return true
    }
}

class Bd {
    constructor(){
        let id = localStorage.getItem('id')

        if(id === null){
            localStorage.setItem('id', 0)
        }

    }

    getProximoId(){
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }

    gravar(d){
        
        let id = this.getProximoId()
        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem('id', id)

    }

    recuperarTodosRegistros(){
        let despesas = Array()
        let ident = localStorage.getItem('id')

        for(let i = 1; i <= ident; i++){

            let despesa = JSON.parse(localStorage.getItem(i))

            if(despesa === null){
                continue
            }
            despesa.id = i
            despesas.push(despesa)
        }
        return despesas
    }
    pesquisar(despesa){

        let despesasFiltradas = Array()

        despesasFiltradas = this.recuperarTodosRegistros()

        if(despesa.ano != ''){
          despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }
        if(despesa.mes != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }
        if(despesa.dia != ''){
          despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }
        if(despesa.tipo != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }
        if(despesa.descricao != ''){
          despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }
        if(despesa.valor != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }

        return despesasFiltradas
    }

    remover(id){

        localStorage.removeItem(id)

    }

}

let bd = new Bd()

function cadastrarDespesa(){

    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    )
    
    if(despesa.validarDados()){
        bd.gravar(despesa)

        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        document.getElementById('valor').value = ''

        document.getElementById('modal_titulo').innerHTML = 'Despesa cadastrada com sucesso!'
        document.getElementById('modal_conteudo').innerHTML = 'Sua despesa foi salva.'
        document.getElementById('modal_titulo_div').className = 'modal-header text-success'
        document.getElementById('botao_modal').className = 'btn btn-success'

        $('#registroDespesa').modal('show')
    }else{
        document.getElementById('modal_titulo').innerHTML = "Erro no cadastro!"
        document.getElementById('modal_conteudo').innerHTML = 'Há itens obrigatórios não preenchidos!'
        document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
        document.getElementById('botao_modal').className = 'btn btn-danger'

        $('#registroDespesa').modal('show')

    }
}
function carregaListasDespesas(despesas = Array()){

    if(despesas.length == 0){

        despesas = bd.recuperarTodosRegistros()
    }

    let listaDespesas = document.getElementById('tabelaDespesas')
    listaDespesas.innerHTML = ''

    despesas.forEach(function(d) {
        let linha = listaDespesas.insertRow()

        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

        switch(d.tipo) {
            case '1': d.tipo = 'Alimentação'
                break
            case '2': d.tipo = 'Educação'
                break
            case '3': d.tipo = 'Lazer'
                break
            case '4': d.tipo = 'Saúde'
                break
            case '5': d.tipo = 'Transporte'
                break

        }
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

        let btn = document.createElement("button")
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = d.id
        btn.onclick = function (){

            bd.remover(this.id)

            window.location.reload()

        }
        linha.insertCell(4).append(btn)
    })

}

function pesquisarDespesa(){

    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    bd.pesquisar(despesa)

    let despesas = bd.pesquisar(despesa)

    carregaListasDespesas(despesas)

}