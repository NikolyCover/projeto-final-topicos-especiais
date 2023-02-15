const ALTERAR = 1;
const EXCLUIR = 2;

const URL_API = "http://localhost:8080/veiculos"

const STATUS_OK = 200;
const STATUS_CREATED = 201;

const IDX_STORAGE_ID = 'idVeiculo';
const IDX_STORAGE_MSG_SUCESSO = 'msgSucesso';
const IDX_STORAGE_MSG_ERRO = 'msgErro';

function loadVehicles() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", URL_API, false);
    xhttp.send();

    var retorno = xhttp.responseText;
    var vehicles = JSON.parse(retorno);

    var tabela = document.getElementById('tbVehicles');
    
    //Remover o body na tabela caso exista
    var corpo = tabela.getElementsByTagName('tbody');
    if(corpo && corpo.length > 0)
        tabela.removeChild(corpo[0]);
    
    //Criar o body na tabela
    corpo = document.createElement('tbody');
    tabela.appendChild(corpo);

    //Criar as linhas com os clientes
    for(var i=0; i<vehicles.length; i++) {
        var linha = corpo.insertRow();
        linha.insertCell().innerHTML = vehicles[i].placa;
        linha.insertCell().innerHTML = vehicles[i].modelo;
        linha.insertCell().innerHTML = vehicles[i].fabricante;
        linha.insertCell().innerHTML = vehicles[i].anoFabricacao;
        var botao2 = criarBotao("Excluir", "btn btn-danger", 
            EXCLUIR, vehicles[i].id);
        linha.insertCell().appendChild(botao2);
    }
    
}

function loadVehiclesData() {
    var id = localStorage.getItem(IDX_STORAGE_ID); //Se encontrou o ID, é uma alteração

    if(id) {
        //Carregar os clientes a partir da API
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", URL_API + "/" + id, false);
        xhttp.send();

        //Seta os dados do cliente para o formulário
        var retorno = xhttp.responseText;
        var vehicle = JSON.parse(retorno);
        document.getElementById("txtPlaca").value = vehicle.placa;
        document.getElementById("txtModelo").value = vehicle.modelo;
        document.getElementById("txtFabricante").value = vehicle.fabricante;
        document.getElementById("txtAno").value = vehicle.anoFabricacao;
    }
}

function addVehicle() {
    localStorage.removeItem(IDX_STORAGE_ID); //Necessário para a ALTERAÇÃO
    window.location = "create-vehicles.html";
}

function editVehicle(id) {
    localStorage.setItem(IDX_STORAGE_ID, id);
    window.location = '';
}

function saveVehicle() {
    var placa = document.getElementById('txtPlaca').value;
    var modelo = document.getElementById('txtModelo').value;
    var fabricante = document.getElementById('txtFabricante').value;
    var ano = document.getElementById('txtAno').value


    var vehicle = { "placa": placa,
                    "modelo": modelo,
                    "fabricante": fabricante,
                    "anoFabricacao": ano };

    var url = URL_API;
    var method = 'POST';
    
    var id = localStorage.getItem(IDX_STORAGE_ID);
    if(id) {
        url = url + "/" + id;
        method = "PUT";
    }

    var xhttp = new XMLHttpRequest();
    xhttp.open(method, url, false);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(vehicle));

    if(xhttp.status == STATUS_CREATED || xhttp.status == STATUS_OK) {
        window.location = 'vehicles.html';
    } else {
        var msg = retornaMsgErro(xhttp.responseText);

        //Exibe a mensagem de erro na tela
        var divErro = document.getElementById('divErro');
        divErro.innerHTML = msg;
        divErro.style.display = 'block';
    }
}

function deleteVehicle(id) {
    
    if(! confirm('Confirma a exclusão do veículo?'))
        return;

    
    var xhttp = new XMLHttpRequest();
    var url = URL_API + "/" + id;
    xhttp.open("DELETE", url, false);
    xhttp.send();

    if(xhttp.status == STATUS_OK) {
        loadVehicles();
        var divMsg = document.getElementById('divSucesso');
        divMsg.innerHTML = "Cliente excluído com sucesso.";
        divMsg.style.display = "block";
    } else {
        var divMsg = document.getElementById('divErro');
        divMsg.innerHTML = "Erro na exclusão do cliente.";
        divMsg.style.display = "block";
    }
}

function criarBotao(texto, classeEstilo, acao, id) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.innerHTML = texto;
    btn.className = classeEstilo;
    
    if(acao == ALTERAR)
        btn.addEventListener("click", function() {
            editVehicle(id);
        });
    else if(acao == EXCLUIR)
        btn.addEventListener("click", function() {
            deleteVehicle(id);
        });

    return btn;
}

//Função AUXILIAR para retornar uma mensagem de erro extraida de um JSON
function retornaMsgErro(jsonErro) {
    var objErro = JSON.parse(jsonErro);
    return objErro.titulo;
}

//Função AUXILIAR para exibir uma mensagem em um componente HTML da tela
function exibeMsgTela(idComponente, mensagem) {
    document.getElementById(idComponente).innerHTML = mensagem;
    document.getElementById(idComponente).style.display = "block";    
}
