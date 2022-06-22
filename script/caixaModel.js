function getReference(){
    const date = new Date();
    let reference = "Pedidos/" + date.getFullYear() +"/" + (date.getMonth() + 1);
    reference += "/" + date.getDate();
    return reference;
}

var pedidosListener = firebase.database().ref(getReference());
pedidosListener.on('value', (snapshot) => {
    for(key in pedidosList){
      delete pedidosList[key];
    }

    snapshot.forEach(function (childSnapshot) {
      let info = childSnapshot.val();
      
      if(info.paymentType == "checar"){
        pedidosList[info.id] = new Pedidos( info.sellerName,
          info.clientName, info.paymentType, info.productsList, 
          info.paymentTime, info.totalValue, info.id, info.sent);
      }
    });
    displayPedidosList()
});

var pedidosList = {};

function displayPedidosList(){
  let list = " <tr> <th>Pedido do Cliente</th> <th>Lista de Produtos</th>";
  list += "<th>Preço Total</th> <th>Metodo De Pagamento</th> <th>Confirmar Pagamento</th></tr>";
  for( key in pedidosList){
    list += "<tr>";
    list += "<th>" + pedidosList[key].clientName + "</th>";
    list += "<th>";
    for(key2 in pedidosList[key].productsList){
      list += pedidosList[key].productsList[key2].name;
      list += " ( " + pedidosList[key].productsList[key2].quantity +") <br />";
    }
    list += "</th>";
    list += "<th> R$ " + pedidosList[key].totalValue.toFixed(2) + "</th>";
    list += "<th> <select id='paymentTypeTo" + pedidosList[key].id + "'>";
    list += "<option value='dinheiro'>Dinheiro</option>";
    list += "<option value='cartão de crédito'>Cartão de crédito</option>";
    list += "<option value='cartão de débito'>Cartão de débito</option>";
    list += "<option value='pix'>PIX</option>";
    list += "</select></th>";
    list += "<th> <button type='button' onclick=\'confirmarPagamento(\"" + pedidosList[key].id + "\")\'>"
    list += "CONFIRMAR PAGAMENTO</button></th>";
    list += "</tr>";
  }

  putList("pedidosList", list);
}

function confirmarPagamento(id){
  const date = new Date();
  let reference = "Pedidos/" + date.getFullYear() +"/" + (date.getMonth() + 1);
  reference += "/" + date.getDate() + "/" + id;

  let paymentType = getInputValue("paymentTypeTo" + id);
  pedidosList[id].paymentType = paymentType;

  console.log(pedidosList[id].paymentType);
  firebase.database().ref(reference).set(pedidosList[id]);
  
}