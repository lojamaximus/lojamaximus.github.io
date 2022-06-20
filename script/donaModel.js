var productsListener = firebase.database().ref('Produtos/');
productsListener.on('value', (snapshot) => {
    console.log(snapshot.val());
    snapshot.forEach(function (childSnapshot) {
      let info = childSnapshot.val();
      productsList[info.name] = new Product(info.name, info.cmv, info.pv, info.information, info.category);
      categoryList[info.category] = info.category;
    });
    putCategoryList();
    displayProductList();
});

var productsList = {};

var categoryList = {};

function putCategoryList(){
  let list = "";
  for (key in categoryList){
    list += "<option value='"+ categoryList[key] +"'></option>";
  }

  putList("categoryList", list);
}

function displayProductList(){
    let list = " <tr> <th>Nome</th> <th>CMV: Custo Mercadoria</th>";
    list += "<th>Preço de Venda</th> <th>Descrição</th> <th>Categoria</th></tr>";
    for( key in productsList){
      list += "<tr>";
      list += "<th>" + productsList[key].name + "</th>";
      list += "<th> R$ " + productsList[key].cmv.toFixed(2) + "</th>";
      list += "<th> R$ " + productsList[key].pv.toFixed(2) + "</th>";
      list += "<th>" + productsList[key].information + "</th>";
      list += "<th>" +  productsList[key].category + "<//th>";
      list += "</tr>";
    }
  
    putList("productList", list);
}

function putList(id, list){
  document.getElementById(id).innerHTML = list;
}