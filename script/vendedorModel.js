/************
 * To-do: 1- Criar um carrinho para o site
 *  2- Criar botão para adicionar o produto ao carrinho (para cada produto, com excessão de acompanhamentos)
 * 
 *  3- Quando clicar no botão de adicionar ao carrinho, caso seja um produto que aceite acompanhamento,
 *     fazer aparecer uma tabela na frente de tudo, com a lista de acompanhamentos que o cliente pode escolher
 * 
 *  4- Criar um botão de carrinho, onde ao clicar nele o cliente pode ver tudo que já escolheu junto de 
 *     quanto está custando o pedido
 */

function getReference(){
    const date = new Date();
    let reference = "Pedidos/" + date.getFullYear() +"/" + (date.getMonth() + 1);
    reference += "/" + date.getDate();
    return reference;
}


var productsListener = firebase.database().ref('Produtos/');
productsListener.on('value', (snapshot) => {
    snapshot.forEach(function (childSnapshot) {
      let info = childSnapshot.val();
      productsList[info.name] = new Product(info.name, 0,
         info.pv, info.information, info.category);
      categoryList[info.category] = info.category;
    });
    displayProductList();
});

var pedidosListener = firebase.database().ref(getReference());
pedidosListener.on('value', (snapshot) => {
    snapshot.forEach(function (childSnapshot) {
      let info = childSnapshot.val();
      

      if(info.withClient === false 
        && (info.sellerName == userCurrent.displayName)
        && (info.sent === true)){
        try{
            if(isAlarmOn){
                if(sendList[info.id].withClient  == false){
                    //already Exist
                }    
            }
        }catch{
            if(isAlarmOn){
                playAlarm();
            }
        }
      
        sendList[info.id] = new Pedidos( info.sellerName,
          info.clientName, info.paymentType, info.productsList, 
          info.paymentTime, info.totalValue, info.id, info.sent, info.withClient);
      }
    });
    displaySendList();
});

var productsList = {};
var categoryList = {};

var sendList = {};

function displaySendList(){
    let list = " <tr> <th>Pedido do Cliente</th> <th>Lista de Produtos</th>";
    list += "<th>Enviar Pedido</th></tr>";
    for( key in sendList){
      list += "<tr>";
      list += "<th>" + sendList[key].clientName + "</th>";
      list += "<th>";
      for(key2 in sendList[key].productsList){
        list += sendList[key].productsList[key2].name;
        list += " ( " + sendList[key].productsList[key2].quantity +" ) <br />";
      }
      list += "</th>";
      list += "<th> <button type='button' onclick=\'enviarPedido(\"" + sendList[key].id + "\")\'>"
      list += "PEDIDO ENTREGUE</button></th>";
      list += "</tr>";
    }
  
    putList("entregaPronta", list);
}

function enviarPedido(id){
    const date = new Date();
    let reference = "Pedidos/" + date.getFullYear() +"/" + (date.getMonth() + 1);
    reference += "/" + date.getDate() + "/" + id;

    sendList[id].withClient = true;
  
    firebase.database().ref(reference).set(sendList[id]);
    delete sendList[id];
    displaySendList();
}

function displayProductList(){
    let list = "";
    for (key in categoryList){
        list += "<h2>" + categoryList[key] + "</h2>";
        list += "<table id='"+ categoryList[key] +"'>";
        list += "<tr>";
        list += "<th> Produto </th>";
        list += "<th> Preço </th>";
        list += "<th> Descrição </th>";
        list += "<th> Quantidade </th>";
        list += "</tr>";
        for(key2 in productsList){
            list += "<tr>";
            if(productsList[key2].category == categoryList[key]){
                list += "<th>" + productsList[key2].name + "</th>";
                list += "<th> R$ " + productsList[key2].pv.toFixed(2) + "</th>";
                list += "<th>" + productsList[key2].information + "</th>";
                list += "<th> <input type='number' value='0' id='" + key2 + "'> </th>"; 
            }
            list += "</tr>";
        }
        list += "</table>";
        list += "<br />";
    }
    putList('listaProdutos', list);
}

var pedido = {};

function checarCompra(){
    let sellList = {};
    for(key in productsList){
        if(getInputValue(key) > 0){
            sellList[key] = new ProductSell(productsList[key].name,
                productsList[key].pv, productsList[key].information,
                getInputValue(key));
        }
    }

    const date = new Date();
    let paymentTime = "";
    paymentTime += date.getDate() + ".." + (date.getMonth() + 1) +".." + date.getFullYear();
    paymentTime += " às " +  date.getHours() + ":";
    if(date.getMinutes() < 10){
        paymentTime += "0"
    } 
    paymentTime += date.getMinutes();

    let totalValue = 0;
    for(key in sellList){
        totalValue += sellList[key].sellPrice();
    }

    let list = "Prelo Total R$" + totalValue.toFixed(2);
    putList("sellPrice", list);

    pedido[getInputValue("clientName")] = new Pedidos(userCurrent.displayName,
         getInputValue("clientName"), "checar",
          sellList, paymentTime, totalValue, "1", false, false);
}

function comprar(){
    try{
        if(pedido[getInputValue("clientName")].clientName == getInputValue("clientName")
        && getInputValue("clientName") != ""){
            const date = new Date();
            let reference = "Pedidos/" + date.getFullYear() +"/" + (date.getMonth() + 1);
            reference += "/" + date.getDate() + "/" + getInputValue("clientName");
            reference += pedido[getInputValue("clientName")].totalValue;
            reference += date.getHours();
            reference += date.getMinutes();
            reference += date.getSeconds();
            reference += date.getMilliseconds();

            let idArray = reference.split("/");
            let id = idArray[(idArray.length - 1)];
            pedido[getInputValue("clientName")].id = id;
            firebase.database().ref(reference).set(pedido[getInputValue("clientName")]);
            document.getElementById("clientName").value = "";
        }else{
            alert("Nome do cliente está vazio");
        }
    }
    catch{
        alert("Nome do cliente está vazio");
    }
}