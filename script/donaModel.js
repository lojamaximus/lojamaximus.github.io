var productsListener = firebase.database().ref('Produtos/');
var usersListener = firebase.database().ref("ChecarUsuarios/");
var workersListener = firebase.database().ref("Empregados/");

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
  for(key in possibleWorkers){
    delete possibleWorkers[key];
  }
  snapshot.forEach(function (childSnapshot) {
    let info = childSnapshot.val();
    possibleWorkers[info.id] = new User(info.name, info.id);
  });
  displayUsersList();
});

workersListener.on('value', (snapshot) => {
  for(key in workersList){
    delete workersList[key];
  }

  snapshot.forEach(function (childSnapshot) {
    let info = childSnapshot.val();
    workersList[info.id] = new Worker(info.name, info.id, info.emprego);
  });
  displayWorkersList();
});

var productsList = {};
var categoryList = {};
var possibleWorkers = {};
var workersList = {};

function putCategoryList(){
  let list = "";
  for (key in categoryList){
    list += "<option value='"+ categoryList[key] +"'></option>";
  }

  putList("categoryList", list);
}

function displayProductList(){
  let list = " <tr> <th>Nome</th> <th>CMV: Custo Mercadoria</th>";
  list += "<th>Preço de Venda</th> <th>Descrição</th> <th>Categoria</th>";
  list += " <th>Acompanhamento</th> <th>Categoria de acompanhamento</th> </tr>"
  for( key in productsList){
    list += "<tr>";
    list += "<th>" + productsList[key].name + "</th>";
    list += "<th> R$ " + productsList[key].cmv.toFixed(2) + "</th>";
    list += "<th> R$ " + productsList[key].pv + "</th>";
    list += "<th>" + productsList[key].information + "</th>";
    list += "<th>" +  productsList[key].category + "<//th>";
    list += "<th>" + productsList[key].sideDish + "</th>";
    list += "<th>" + productsList[key].sideDishCategory + "</th>";
    list += "</tr>";
  }

  putList("productList", list);
}

function deleteUser(id){
  let reference = "ChecarUsuarios/" + id;
  firebase.database().ref(reference).remove();
}

function deleteWorker(id){
  let reference = "Empregados/" + id;
  firebase.database().ref(reference).remove();
}

function addWorker(id){
  let job = document.getElementById("jobTo" + id).value;
  let worker = new Worker(possibleWorkers[id].name, id, job);
  let reference = "Empregados/" + id;
  firebase.database().ref(reference).set(worker);
  deleteUser(id);
}

function updateWorker(id){
  let job = document.getElementById("changeTo" + id).value;
  let worker = new Worker(workersList[id].name, id, job);
  let reference = "Empregados/" + id;
  firebase.database().ref(reference).set(worker);
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

function displayWorkersList(){
  let list = " <tr> <th>Nome</th> <th> Emprego Atual </th> <th>Escolher Emprego</th>";
  list += "<th>Mudar Emprego</th> <th>Excluir</th></tr>";
  for( key in workersList){
    list += "<tr>";
    list += "<th>" + workersList[key].name + "</th>";
    list += "<th> " + workersList[key].emprego + "</th> "
    list += "<th> <select id='changeTo" + workersList[key].id + "'>";
    list += "<option value='vendedor'>Vendedor(a)</option>";
    list += "<option value='caixa'>Caixa</option>";
    list += "<option value='dona'>Administrador(a)</option>";
    list += "<option value='cozinha'>Cozinheiro(a)</option>";
    list += "</select></th>";
    list += "<th> <button type='button' onclick=\'updateWorker(\"" + workersList[key].id + "\")\'>"
    list += "MUDAR</button></th>";
    list += "<th> <button type='button' onclick=\'deleteWorker(\"" + workersList[key].id +"\")\'>"
    list += "TIRAR TRABALHADOR</button></th>";
    list += "</tr>";
  }

  putList("workersList", list);
}

function saveProduct(){
  let name = getInputValue('productName');
  let pv = roundMoney(getInputValue("productPV"));
  let cmv = roundMoney(getInputValue("productCMV"));
  let information = getInputValue("productInformation");
  let category = getInputValue("category");
  let sideDish = getInputValue("isHasSideDish");
  let sideDishCategory = getInputValue("sideDishCategory");

  if(sideDish == "doNotHave"){
    sideDishCategory = " ";
  }


  let product = new Product(name, cmv, pv,
     information, category, sideDish, sideDishCategory);

  let reference = "Produtos/" + name;
  firebase.database().ref(reference).set(product);  
}