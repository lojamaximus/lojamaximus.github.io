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

    constructor(name, cmv, pv, information){
        this.name = name;
        this.cmv = cmv;
        this.pv = pv;
        this.information = information;
    }

    lucroBruto(){
        return this.pv - this.cmv;
    }
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
    constructor(sellerName, clientName, paymentType, productsList, paymentTime){
        this.sellerName = sellerName;
        this.clientName = clientName;
        this.paymentType = paymentType;
        this.productsList = productsList;
        this.paymentTime = paymentTime;
    }

    set paymentType(newPaymentType){
        if (newPaymentType === null 
            || (newPaymentType.length === 0)){
            alert("Selecione a forma de pagamento");
        }
        this.paymentType = newPaymentType;
    }
}

var userCurrent;
var databaseRef = firebase.database();

firebase.auth().onAuthStateChanged(user => {
    if (user) {
      if(isUserOnCheckJob()){
        checkUserJob(user);    
      } else{
        isUserOnTheRightPage(user);
      }
      
      return;
    }
    else {
        userNotLogged();
    }
})

function checkUserJob(user){
    let reference = "Empregados/" + user.uid;
    databaseRef.ref(reference).once('value', (snapshot) => {
        let job = snapshot.val().emprego;
        let path = "$.html";
        path = path.replace("$", job);
        window.location.replace(path);
    });
}

function isUserOnTheRightPage(user){
    let reference = "Empregados/" + user.uid;
    databaseRef.ref(reference).once('value', (snapshot) => {
        let job = snapshot.val().emprego;
        console.log(job);
        let checkPath = '/$.html';
        checkPath = checkPath.replace("$", job);
        if( window.location.pathname !== checkPath){
            console.log(window.location.pathname);
            console.log(checkPath);
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
    console.log("USER ON WRONG PAGE");
}