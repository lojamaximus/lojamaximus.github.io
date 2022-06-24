/******************************
 * Funcionarios só podem ver o preço de venda e descrição do produto
 * Eles não podem ver o cmv ou lucro bruto
 * 
 * Os pedidos dos clientes devem ir direto para a cozinha assim que o pedido for feito.
 * 
 * Colocar barulho quando chegar o pedido
 */

class User{
    constructor(name, id){
        this.name = name;
        this.id = id;
    }
}

class Worker{
    constructor(name, id, emprego){
        this.name = name;
        this.id = id;
        this.emprego = emprego;
    }
}

var typeOfUsers = {
    "vendedor" : 'vendedor', //Can only send new orders; change the order they received; Put order as fulfilled
    "caixa" : 'caixa', //Can only check the orders and put their payment type 
    "dona" : 'dona', //Can check the money won and put the others users job
    "cozinha" : 'cozinha' //Can check which orders was not fulfilled yet
    
}

class Product{
    //cmv = custo mercadoria vendida
    //pv = preço de venda
    //information = descrição do produto

    constructor(name, cmv, pv, information, category, sideDish, sideDishCategory){
        this.name = name;
        this.cmv = cmv;
        this.pv = pv;
        this.information = information;
        this.category = category;
        this.sideDish = sideDish;
        this.sideDishCategory = sideDishCategory;
    }

    lucroBruto(){
        return roundMoney(this.pv - this.cmv);
    }
}

function roundMoney(value){
    let result = Math.round(value * 100)/100;
    return result;
}

class ProductSell{
    constructor(name, pv, information, quantity){
        this.name = name;
        this.pv = pv;
        this.information = information;
        this.quantity = quantity;
    }

    sellPrice(){
        return this.pv * this.quantity;
    }
}

class PaymentType{
    constructor(name, pricePaid){
        this.name = name;
        this.pricePaid = pricePaid;
    }
}
/************************
 * Na forma de pagamento deixar o caixa colocar mais de uma forma de pagamento ao mesmo tempo.
 * Cada forma de pagamento adicionada deve conter a quantidade paga.
 * 
 * O horário de pagamento deve ser automático
 */
class Pedidos{
    constructor(sellerName, clientName, paymentType, productsList, paymentTime, totalValue, id, sent, withClient){
        this.sellerName = sellerName;
        this.clientName = clientName;
        this.paymentType = paymentType;
        this.productsList = productsList;
        this.paymentTime = paymentTime;
        this.totalValue = totalValue;
        this.id = id;
        this.sent = sent;
        this.withClient = withClient;
    }
}

var userCurrent;
var databaseRef = firebase.database();

firebase.auth().onAuthStateChanged(user => {
    if (user) {
      userCurrent = user;
      if(isUserOnCheckJob()){
        checkUserJob(user);    
      } else{
        isUserOnTheRightPage(user);
      }
      
      return;
    }
    else {
        userOnWrongPage();
    }
})

function saveUser(){
    let reference = "ChecarUsuarios/" + userCurrent.uid;
    firebase.database().ref(reference).set({
        name: userCurrent.displayName,
        id: userCurrent.uid
    });
}

function getInputValue(id){
    return  document.getElementById(id).value;
}

function checkUserJob(user){
    let reference = "Empregados/" + user.uid;
    databaseRef.ref(reference).once('value', (snapshot) => {
        try{
            let job = snapshot.val().emprego;
            let path = "$.html";
            path = path.replace("$", job);
            window.location.replace(path);
        }catch{
            saveUser();
        }
    });
}

function isUserOnTheRightPage(user){
    let reference = "Empregados/" + user.uid;
    databaseRef.ref(reference).once('value', (snapshot) => {
        try{
            let job = snapshot.val().emprego;
            let checkPath = '/$.html';
            checkPath = checkPath.replace("$", job);
            if( window.location.pathname !== checkPath){
                userOnWrongPage();
            }
        }catch{
            userOnWrongPage();
        }

    });
}

function isUserOnCheckJob(){
    let result = false;
    if( window.location.pathname === '/checkjob.html'){
      result = true;
    }
    return result;
}

function userOnWrongPage(){
  window.location.replace("espera.html");
}

function putList(id, list){
    document.getElementById(id).innerHTML = list;
}
