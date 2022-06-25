function getReference(){
    const date = new Date();
    let reference = "Pedidos/" + date.getFullYear() +"/" + (date.getMonth() + 1);
    reference += "/" + date.getDate();
    return reference;
}

var pedidosListener = firebase.database().ref(getReference());
pedidosListener.on('value', (snapshot) => {
    for(let key in pedidosList){
      delete pedidosList[key];
    }

    snapshot.forEach(function (childSnapshot) {
      let info = childSnapshot.val();
      for(let key2 in info.paymentType){
        if(info.paymentType[key2].name == "checar"){
          pedidosList[info.id] = new Pedidos( info.sellerName,
          info.clientName, info.paymentType, info.productsList, 
          info.paymentTime, info.totalValue, info.id, info.sent, info.withClient);
          break;
        }
     }
    });
    displayPedidosList()
});

var pedidosList = {};

function displayPedidosList(){
  let list = " <tr> <th>Pedido do Cliente</th> <th>Lista de Produtos</th>";
  list += "<th>Preço Total</th> <th>Metodo De Pagamento</th> <th>Confirmar Pagamento</th></tr>";
  for(let key in pedidosList){
    list += "<tr>";
    list += "<th>" + pedidosList[key].clientName + "</th>";
    list += "<th>";
    for(let key2 in pedidosList[key].productsList){
      list += pedidosList[key].productsList[key2].name;
      list += " ( " + pedidosList[key].productsList[key2].quantity +") <br />";
    }
    list += "</th>";
    list += "<th> R$ " + pedidosList[key].totalValue.toFixed(2) + "</th>";
    list += "<th> "
    
    list += "Dinheiro: <input id='moneyPaymentTypeTo" + pedidosList[key].id + "'";
    list += "name='paymentoOf"+ pedidosList[key].id ;
    list += "' type='number' value='0' min='0' max='" +  pedidosList[key].totalValue;
    list += "' step='0.05' > <button type='button' ";
    list += "onclick=\'putTheRest(\"" + "moneyPaymentTypeTo" + pedidosList[key].id + "\","
    list += "\"" + pedidosList[key].id +"\")\'>";
    list += "RESTO</button> <br \>";

    list += "Cartão de crédito: <input id='creditPaymentTypeTo" + pedidosList[key].id + "'";
    list += "name='paymentoOf"+ pedidosList[key].id ;
    list += "' type='number' value='0' min='0' max='" +  pedidosList[key].totalValue 
    list += "' step='0.05' > <button type='button' ";
    list += "onclick=\'putTheRest(\"" + "creditPaymentTypeTo" + pedidosList[key].id + "\","
    list += "\"" + pedidosList[key].id +"\")\'>";
    list += "RESTO</button> <br \>";

    list += "Cartão de débito: <input id='debitPaymentTypeTo" + pedidosList[key].id + "'";
    list += "name='paymentoOf"+ pedidosList[key].id ;
    list += "' type='number' value='0' min='0' max='" +  pedidosList[key].totalValue 
    list += "' step='0.05' > <button type='button' ";
    list += "onclick=\'putTheRest(\"" + "debitPaymentTypeTo" + pedidosList[key].id + "\","
    list += "\"" + pedidosList[key].id +"\")\'>";
    list += "RESTO</button><br \>";

    list += "Pix: <input id='pixPaymentTypeTo" + pedidosList[key].id + "'";
    list += "name='paymentoOf"+ pedidosList[key].id ;
    list += "' type='number' value='0' min='0' max='" +  pedidosList[key].totalValue 
    list += "' step='0.05' > <button type='button' ";
    list += "onclick=\'putTheRest(\"" + "pixPaymentTypeTo" + pedidosList[key].id + "\","
    list += "\"" + pedidosList[key].id +"\")\'>";
    list += "RESTO</button> <br \>";

    list += "</th>";
    list += "<th> <button type='button'"
    list += " onclick=\'confirmarPagamento(\"" + pedidosList[key].id + "\", \""+ key +"\")\'>"
    list += "CONFIRMAR</button></th>";
    list += "</tr>";
  }

  putList("pedidosList", list);
}

function putTheRest(paymentTagId, pedidoListId){
  if(checkPayment(pedidoListId, false)){
    let payment = getTotalPayment(pedidoListId);
    let totalPayment = pedidosList[pedidoListId].totalValue;
    let rest = totalPayment - payment;

    if(rest > 0){
      document.getElementById(paymentTagId).value = rest;
    }
  }
}

function getTotalPayment(pedidoListId){
  let payment = 0;
  let payments = document.getElementsByName("paymentoOf" + pedidoListId);
  payments.forEach((payments) => {
    payment += parseFloat(payments.value);
  });
  return payment;
}

function checkPayment(pedidoListId, final){
  let payment = getTotalPayment(pedidoListId);
  let totalPayment = pedidosList[pedidoListId].totalValue;
  if(payment > totalPayment){
    window.alert("O pagamento está maior que o preço");
    return false;
  }

  if(payment < totalPayment && final){
    window.alert("O pagamento está menor que o preço");
    return false;
  }

  return true;
}

function confirmarPagamento(id, pedidoListId){
  if(checkPayment(pedidoListId, true)){
    const date = new Date();
    let reference = "Pedidos/" + date.getFullYear() +"/" + (date.getMonth() + 1);
    reference += "/" + date.getDate() + "/" + id;

    let paymentType = {}
    let i = 0;
    let payments = document.getElementsByName("paymentoOf" + pedidoListId);

    for(let key in pedidosList[id].paymentType){
      delete pedidosList[id].paymentType[key];
    }

    payments.forEach((payments) => {
      switch(i){
        case 0: {
          if(parseFloat(payments.value) > 0){
            paymentType["money"] = new PaymentType('money',parseFloat(payments.value));
          }
          break;
        }

        case 1: {
          if(parseFloat(payments.value) > 0){
            paymentType["credit"] = new PaymentType("credit",parseFloat(payments.value));
          }
          break;
        }

        case 2: {
          if(parseFloat(payments.value) > 0){
            paymentType["debit"] = new PaymentType("debit",parseFloat(payments.value));
          }
          break;
        }

        case 3: {
          if(parseFloat(payments.value) > 0){
            paymentType["pix"] = new PaymentType("pix",parseFloat(payments.value));
          }
          break;
        }
      }
      i++;
    });
    pedidosList[id].paymentType = paymentType;

    console.log(pedidosList[id]);
    firebase.database().ref(reference).set(pedidosList[id]);
    delete pedidosList[id];
    displayPedidosList();
  }
}