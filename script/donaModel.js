/***********
 * todo: 1- Calcular lucro do dia de acordo com cada tipo de pagamento
 * 2- Colocar lista de todos os meses que teve pagamento
 * 3- Na lista dos meses mostra o lucro de cada mês, de acordo com cada tipo de pagamento
 */

var productsListener = firebase.database().ref('Produtos/');
var usersListener = firebase.database().ref("ChecarUsuarios/");
var workersListener = firebase.database().ref("Empregados/");

productsListener.on('value', (snapshot) => {
    snapshot.forEach(function (childSnapshot) {
      let info = childSnapshot.val();
      if(info.sideDish == "itHas"){
        sideDishCategoryList[info.sideDishCategory] = info.sideDishCategory;
      }
      productsList[info.name] = new Product(info.name, info.cmv,
         info.pv, info.information, info.category, info.sideDish, info.sideDishCategory);
      categoryList[info.category] = info.category;
    });
    putCategoryList();
    putSideDishCategoryList();
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
var sideDishCategoryList = {};
var possibleWorkers = {};
var workersList = {};

function putCategoryList(){
  let list = "";
  for (key in categoryList){
    list += "<option value='"+ categoryList[key] +"'></option>";
  }

  putList("categoryList", list);
}

function putSideDishCategoryList(){
  let list = "";
  for (key in sideDishCategoryList){
    list += "<option value='"+ sideDishCategoryList[key] +"'></option>";
  }

  putList("sideDishCategoryList", list);
}

function displayProductList(){
  let list = " <tr> <th>Nome</th> <th>CMV: Custo Mercadoria</th>";
  list += "<th>Preço de Venda</th> <th>Descrição</th> <th>Categoria</th>";
  list += " <th>Acompanhamento</th> <th>Categoria de acompanhamento</th> </tr>"
  for( key in productsList){
    list += "<tr>";
    list += "<th>" + productsList[key].name + "</th>";
    list += "<th> R$ " + productsList[key].cmv.toFixed(2) + "</th>";
    list += "<th> R$ " + productsList[key].pv.toFixed(2) + "</th>";
    list += "<th>" + productsList[key].information + "</th>";
    list += "<th>" +  productsList[key].category + "</th>";
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
  let job = getJobList(id);
  let worker = new Worker(possibleWorkers[id].name, id, job);
  let reference = "Empregados/" + id;
  firebase.database().ref(reference).set(worker);
  deleteUser(id);
}

function getJobList(workerId){
  let id = "workXY";
  let job = {};
  for(let i = 1; i < 5; i++){
    id = id.replace("X", i);
    id = id.replace("Y", workerId);
    let check = document.getElementById(id);
    if(check.checked){
      job[check.value] = check.value;
    }
    id = "workXY";
  }
  return job;
}

function updateWorker(id){
  let job = getJobList(id);
  
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
      list += "<th> ";
      list += "<label for='work1'> Vendedor(a): </label>"
      list += "<input type='checkbox' id='work1"+ possibleWorkers[key].id +"' value='vendedor' /> <br/>" ;
      list += "<label for='work2'> Caixa: </label>"
      list += "<input type='checkbox' id='work2"+ possibleWorkers[key].id + "' value='caixa' /><br/>" ;
      list += "<label for='work3'> Cozinheiro(a): </label>"
      list += "<input type='checkbox' id='work3"+ possibleWorkers[key].id +"' value='cozinha' /><br/>" ;
      list += "<label for='work4'> Administrador: </label>"
      list += "<input type='checkbox' id='work4"+ possibleWorkers[key].id +"' value='dona' /><br/>" ;
      list += "</th>";
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
  for( let key in workersList){
    list += "<tr>";
    list += "<th>" + workersList[key].name + "</th>";
    list += "<th> " ;
    for(let key2 in workersList[key].emprego){
      list += "<p> " + workersList[key].emprego[key2] + "</p>";
    }
    list += "</th> ";
    list += "<th> ";
    list += "<label for='work1'> Vendedor(a): </label>"
    list += "<input type='checkbox' id='work1"+ workersList[key].id +"' value='vendedor' /> <br/>" ;
    list += "<label for='work2'> Caixa: </label>"
    list += "<input type='checkbox' id='work2"+ workersList[key].id + "' value='caixa' /><br/>" ;
    list += "<label for='work3'> Cozinheiro(a): </label>"
    list += "<input type='checkbox' id='work3"+ workersList[key].id +"' value='cozinha' /><br/>" ;
    list += "<label for='work4'> Administrador: </label>"
    list += "<input type='checkbox' id='work4"+ workersList[key].id +"' value='dona' /><br/>" ;
    list += "</th>";
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