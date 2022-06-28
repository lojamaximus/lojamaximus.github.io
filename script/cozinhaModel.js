function getReference(){
    const date = new Date();
    let reference = "Pedidos/" + date.getFullYear() +"/" + (date.getMonth() + 1);
    reference += "/" + date.getDate();
    return reference;
}


var pedidosListener = firebase.database().ref(getReference());
pedidosListener.on('value', (snapshot) => {
    snapshot.forEach(function (childSnapshot) {
      let info = childSnapshot.val();
      
      if(info.sent === false){
        try{
            if(isAlarmOn){
                if(pedidosList[info.id].sent == false){
                    //Already exists
                }    
            }
        }catch{
            if(isAlarmOn){
                playAlarm();
            }
        }
      
        pedidosList[info.id] = new Pedidos( info.sellerName,
          info.clientName, info.paymentType, info.productsList, 
          info.paymentTime, info.totalValue, info.id, info.sent, info.withClient);
      }
    });
    displayPedidosList();
});

var pedidosList = {};

function displayPedidosList(){
    let list = " <tr> <th>Pedido do Cliente</th> <th>Lista de Produtos</th>";
    list += "<th>Enviar Pedido</th></tr>";
    for( key in pedidosList){
      list += "<tr>";
      list += "<th>" + pedidosList[key].clientName + "</th>";
      list += "<th>";
      for(key2 in pedidosList[key].productsList){
        list += pedidosList[key].productsList[key2].name;
        list += " ( " + pedidosList[key].productsList[key2].quantity +" ) <br />";
        if(pedidosList[key].productsList[key2].sideDishList != null){
            list += " Acompanhamentos { <br/>";
            for(let key3 in pedidosList[key].productsList[key2].sideDishList){
                list += pedidosList[key].productsList[key2].sideDishList[key3].name;
                list += " ( ";
                list += pedidosList[key].productsList[key2].sideDishList[key3].quantity;
                list += " ) <br/>";
            }
            list += "} <br/>";
        }
      }
      list += "</th>";
      list += "<th> <button type='button' onclick=\'enviarPedido(\"" + pedidosList[key].id + "\")\'>"
      list += "PEDIDO PRONTO</button></th>";
      list += "</tr>";
    }
  
    putList("pedidosList", list);
}

function enviarPedido(id){
    const date = new Date();
    let reference = "Pedidos/" + date.getFullYear() +"/" + (date.getMonth() + 1);
    reference += "/" + date.getDate() + "/" + id;

    pedidosList[id].sent = true;
  
    firebase.database().ref(reference).set(pedidosList[id]);
    delete pedidosList[id];
    displayPedidosList();
    
}