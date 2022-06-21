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
      //console.log(info);
      if(info.paymentType == "checar"){
        console.log(info.clientName);
      }
      /*productsList[info.name] = new Product(info.name, 0,
         info.pv, info.information, info.category);
      categoryList[info.category] = info.category;*/
    });


});

/*
 Todo: Colocar a lista de produtos na tela com a opção d
 trocar a forma de pagamento apenas.
*/
var pedidosList = {};