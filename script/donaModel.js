var productsListener = firebase.database().ref('Produtos/');
var usersListener = firebase.database().ref("ChecarUsuarios/");

productsListener.on('value', (snapshot) => {
    snapshot.forEach(function (childSnapshot) {
      let info = childSnapshot.val();
      productsList[info.name] = new Product(info.name, info.cmv,
         info.pv, info.information, info.category);
      categoryList[info.category] = info.category;
    });
    putCategoryList();
    displayProductList();
});

usersListener.on('value', (snapshot) => {
  console.log(snapshot.val());
  for(key in possibleWorkers){
    delete possibleWorkers[key];
  }
  snapshot.forEach(function (childSnapshot) {
    let info = childSnapshot.val();
    possibleWorkers[info.id] = new User(info.name, info.id);
  });
  displayUsersList();
});

var productsList = {};
var categoryList = {};
var possibleWorkers = {};

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

function deleteUser(id){
  let reference = "ChecarUsuarios/" + id;
  firebase.database().ref(reference).remove();
}

function addWorker(id){
  let job = document.getElementById("jobTo" + id).value;
  let reference = "Empregados/" + id;
  firebase.database().ref(reference).set({
      name: possibleWorkers[id].name,
      id: id,
      emprego: job
  });
  //deleteUser(id);
}

function displayUsersList(){
    let list = " <tr> <th>Nome</th> <th>Escolher Emprego</th>";
    list += "<th>Adicionar</th> <th>Excluir</th></tr>";
    for( key in possibleWorkers){
      list += "<tr>";
      list += "<th>" + possibleWorkers[key].name + "</th>";
      list += "<th> <select id='jobTo" + possibleWorkers[key].id + "'>";
      list += "<option value='vendedor'>Vendedor(a)</option>";
      list += "<option value='caixa'>Caixa</option>";
      list += "<option value='dona'>Administrador(a)</option>";
      list += "<option value='cozinha'>Cozinheiro(a)</option>";
      list += "</select></th>";
      list += "<th> <button type='button' onclick=\'addWorker(\"" + possibleWorkers[key].id + "\")\'>"
      list += "CONFIRMAR EMPREGO</button></th>";
      list += "<th> <button type='button' onclick=\'deleteUser(\"" + possibleWorkers[key].id +"\")\'>"
      list += "DELETAR USUÁRIO</button></th>";
      list += "</tr>";
    }
  
    putList("userList", list);
}

function putList(id, list){
  document.getElementById(id).innerHTML = list;
}