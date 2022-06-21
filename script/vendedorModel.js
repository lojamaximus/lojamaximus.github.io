var productsListener = firebase.database().ref('Produtos/');
productsListener.on('value', (snapshot) => {
    snapshot.forEach(function (childSnapshot) {
      let info = childSnapshot.val();
      productsList[info.name] = new Product(info.name, 0,
         info.pv, info.information, info.category);
      categoryList[info.category] = info.category;
    });
    displayProductList();
});

var productsList = {};
var categoryList = {};

function displayProductList(){
    let list = "";
    for (key in categoryList){
        list += "<h2>" + categoryList[key] + "</h2>";
        list += "<table id='"+ categoryList[key] +"'>";
        list += "<tr>";
        list += "<th> Produto </th>";
        list += "<th> Preço </th>";
        list += "<th> Descrição </th>";
        list += "<th> Quantidade </th>";
        list += "</tr>";
        for(key2 in productsList){
            list += "<tr>";
            if(productsList[key2].category == categoryList[key]){
                list += "<th>" + productsList[key2].name + "</th>";
                list += "<th> R$ " + productsList[key2].pv.toFixed(2) + "</th>";
                list += "<th>" + productsList[key2].information + "</th>";
                list += "<th> <input type='number' value='0' id='" + key2 + "'> </th>"; 
            }
            list += "</tr>";
        }
        list += "</table>";
        list += "<br />";
    }
    putList('listaProdutos', list);
}

var pedido = {};

function checarCompra(){
    let sellList = {};
    for(key in productsList){
        if(getInputValue(key) > 0){
            console.log(getInputValue(key));
            sellList[key] = new ProductSell(productsList[key].name,
                productsList[key].pv, productsList[key].information,
                getInputValue(key));
        }
    }

    const date = new Date();
    let paymentTime = "";
    paymentTime += date.getDate() + ".." + (date.getMonth() + 1) +".." + date.getFullYear();
    paymentTime += " às " +  date.getHours() + ":";
    if(date.getMinutes() < 10){
        paymentTime += "0"
    } 
    paymentTime += date.getMinutes();

    let totalValue = 0;
    console.log(sellList);
    for(key in sellList){
        totalValue += sellList[key].sellPrice();
    }

    let list = "Prelo Total R$" + totalValue.toFixed(2);
    putList("sellPrice", list);

    pedido[getInputValue("clientName")] = new Pedidos(userCurrent.displayName,
         getInputValue("clientName"), "checar", sellList, paymentTime, totalValue, "1");

    console.log(pedido);
}

function comprar(){
    try{
        if(pedido[getInputValue("clientName")].clientName == getInputValue("clientName")
        && getInputValue("clientName") != ""){
            const date = new Date();
            let reference = "Pedidos/" + date.getFullYear() +"/" + (date.getMonth() + 1);
            reference += "/" + date.getDate() + "/" + getInputValue("clientName");
            reference += pedido[getInputValue("clientName")].totalValue;
            reference += date.getHours();
            reference += date.getMinutes();
            reference += date.getSeconds();
            reference += date.getMilliseconds();

            let idArray = reference.split("/");
            let id = idArray[(idArray.length - 1)];
            pedido[getInputValue("clientName")].id = id;
            firebase.database().ref(reference).set(pedido[getInputValue("clientName")]);
            document.getElementById("clientName").value = "";
        }else{
            alert("Nome do cliente está vazio");
        }
    }
    catch{
        console.log("Pedido vazio");
    }
}