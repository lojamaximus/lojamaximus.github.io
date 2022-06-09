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