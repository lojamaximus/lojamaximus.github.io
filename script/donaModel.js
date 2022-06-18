var productsListener = firebase.database().ref('Produtos/');
productsListener.on('value', (snapshot) => {
    console.log(snapshot.val());
    snapshot.forEach(function (childSnapshot) {
      let info = childSnapshot.val();
      console.log(info.name);
      productsList[info.name] = new Product(info.name, info.cmv, info.pv, info.information);
    });
    displayProductList();
});

var productsList = {};

function displayProductList(){
    let list = " <tr> <th>Nome</th> <th>CMV: Custo Mercadoria</th>";
    list += "<th>Preço de Venda</th> <th>Descrição</th> </tr>";
    for( key in productsList){
      list += "<tr>";
      list += "<th>" + productsList[key].name + "</th>";
      list += "<th> R$ " + productsList[key].cmv.toFixed(2) + "</th>";
      list += "<th> R$ " + productsList[key].pv.toFixed(2) + "</th>";
      list += "<th>" + productsList[key].information + "</th>";
      list += "</tr>";
    }
  
    document.getElementById("productList").innerHTML = list;
}