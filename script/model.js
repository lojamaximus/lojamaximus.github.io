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

/*
    "vendedor" : 'vendedor', //Can only send new orders; change the order they received; Put order as fulfilled
    "caixa" : 'caixa', //Can only check the orders and put their payment type 
    "dona" : 'dona', //Can check the money won and put the others users job
    "cozinha" : 'cozinha' //Can check which orders was not fulfilled yet
*/

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
    constructor(name, pv, information, quantity, sideDishList, id){
        this.name = name;
        this.pv = pv;
        this.information = information;
        this.quantity = quantity;
        this.sideDishList = sideDishList;
        this.id = id;
    }

    sellPrice(){
        let price = 0;
        if(getListSize(this.sideDishList) > 0){
            for(let x in this.sideDishList){
                price += this.sideDishList[x].pv * this.sideDishList[x].quantity;
            }
        }
        price += this.pv * this.quantity; 
        return price;
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

    removeProduct(id){
        delete this.productsList[id];
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
        createMenu(user);
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
            for(let key in job){
                let path = "$.html";
                path = path.replace("$", job[key]);
                window.location.replace(path);
                break;
            }
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
            let path = window.location.pathname;
            let search = path.split("/");
            path = search[search.length - 1];
            search = path.split(".");
            path = search[0];
            let check = job[path];
            if(check == null){
                userOnWrongPage();
            }
        }catch{
           userOnWrongPage();
       }

    });
}

function isUserOnCheckJob(){
    let result = false;
    let path = window.location.pathname;
    let search = path.split("/");
    path = search[search.length - 1];
    if( path === 'checkjob.html'){
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

function hideTag(id){
    document.getElementById(id).classList.add('hide');
}
  
function appearTag(id){
    document.getElementById(id).classList.remove('hide');
}

function hasHide(id){
    return document.getElementById(id).classList.contains('hide');
}

function openOrHide(id){
    if(hasHide(id)){
        appearTag(id);
        return;
    }

    hideTag(id);
}

function getListSize(list){
    return Object.keys(list).length;
}

function createMenu(user){
    let reference = "Empregados/" + user.uid;
    databaseRef.ref(reference).once('value', (snapshot) => {
        try{
            let job = snapshot.val().emprego;
            list = "<table> <tr>";
            for(let key in job){
                list += "<th>";
                list += "<a href='" + key + ".html'>  " + key;
                list += "  </a>"
                list += "</th>";
            }
            list += "</tr></table>";
            putList("menu",list);
        }catch{
            userOnWrongPage();
        }
    });
}