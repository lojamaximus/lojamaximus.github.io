class User{
    constructor(name, id){
        this.name = name;
        this.id = id;
    }

    /************
     * Check on database the user job
     * using the id
     */
    getUserJob(){
        return "dona";
    }
}

var typeOfUsers = {
    "vendedor" : 'vendedor', //Can only send new orders; change the order they received; Put order as fulfilled
    "caixa" : 'caixa', //Can only check the orders and put their payment type 
    "dona" : 'dona', //Can check the money won and put the others users job
    "cozinha" : 'cozinha' //Can check which orders was not fulfilled yet
    
}

var userCurrent;
var storage = firebase.storage();
var databaseRef = firebase.database();

firebase.auth().onAuthStateChanged(user => {
    if (user) {
      checkUserJob(user);
      return;
    }
    else {
        userNotLogged();
    }
})

function checkUserJob(){
    
}