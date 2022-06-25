function getReference(){
    const date = new Date();
    let reference = "Pedidos/" + date.getFullYear() +"/" + (date.getMonth() + 1);
    reference += "/" + date.getDate();
    return reference;
}


var productsListener = firebase.database().ref('Produtos/');
productsListener.on('value', (snapshot) => {
    snapshot.forEach(function (childSnapshot) {
      let info = childSnapshot.val();
      if(info.sideDish == "itIs"){
        sideDishList[info.name] = new Product(info.name, 0,
            info.pv, info.information, info.category, info.sideDish, info.sideDishCategory);
      } else {
        productsList[info.name] = new Product(info.name, 0,
            info.pv, info.information, info.category, info.sideDish, info.sideDishCategory);
        categoryList[info.category] = info.category;       
      }
    });
    displayProductList();
});

var pedidosListener = firebase.database().ref(getReference());
pedidosListener.on('value', (snapshot) => {
    snapshot.forEach(function (childSnapshot) {
      let info = childSnapshot.val();
      

      if(info.withClient === false 
        && (info.sellerName == userCurrent.displayName)
        && (info.sent === true)){
        try{
            if(isAlarmOn){
                if(sendList[info.id].withClient  == false){
                    //already Exist
                }    
            }
        }catch{
            if(isAlarmOn){
                playAlarm();
            }
        }
      
        sendList[info.id] = new Pedidos( info.sellerName,
          info.clientName, info.paymentType, info.productsList, 
          info.paymentTime, info.totalValue, info.id, info.sent, info.withClient);
      }
    });
    displaySendList();
});

var productsList = {};
var categoryList = {};
var sendList = {};
var sideDishList = {};
var sideDishCategoryList = {};

var cart = {};
var pedido = {};

function closeCart(){
    hideTag("cart");
    appearTag("content");
    showCartSize();
}

function openCart(){
    hideTag("content");
    appearTag("cart");
    displayCartContent();
}

function closeSideDish(){
    hideTag("sideDish");
    appearTag("content");
    for(let key in sideDishCategoryList){
        delete sideDishCategoryList[key];
    }
}

function openSideDish(id, cartId){
    hideTag("content");
    appearTag("sideDish");
    displaySideDishList(id, cartId);
}

function displayCartContent(){
    let price = 0;
    let list = " <table> <tr> <th>Nome</th> <th>Quantidade</th>";
    list += "<th> Acompanhamentos </th> <th>Preço</th> <th>Remover</th></tr>";

    for(let key in cart){
        console.log(cart[key]);
        price += cart[key].sellPrice();
        console.log(cart[key]);
        list += "<tr>";
        list += "<th> " + cart[key].name + "</th>";
        list += "<th> " + cart[key].quantity + "</th>";
        list += "<th>";
        if(getListSize(cart[key].sideDishList) > 0){
            for(let key2 in cart[key].sideDishList){
                list += cart[key].sideDishList[key2].name;
                list += " ( " + cart[key].sideDishList[key2].quantity;
                list += " ) ";
                list += "<button type='button'";
                list +=" onclick=\'removeSideDishFromCart(\"" + key +"\", \""+ key2 +"\")\'>";
                list += "<i class='glyphicon glyphicon-minus'></i></button> <br />";
            }
        }
        list += "</th>";
        list += "<th> R$ " + cart[key].sellPrice().toFixed(2) + "</th>";
        list += "<th>";
        list += "<button type='button' onclick=\'removeFromCart(\"" + key + "\")\'>";
        list += "<i class='glyphicon glyphicon-minus'></i></button>";
        list += "</th>";
        list += "</tr>";
    }
    list += "</table> <br/>";
    list += "<p> Preço total: R$ " + price.toFixed(2) + "</p>";
    putList("cartContent",list);
}

function getUniqueID() {
    return Math.floor(Math.random() * Date.now())
}


function removeFromCart(id){
    delete cart[id];
    displayCartContent();
}

function displaySendList(){
    let list = " <tr> <th>Pedido do Cliente</th> <th>Lista de Produtos</th>";
    list += "<th>Enviar Pedido</th></tr>";
    for( let key in sendList){
      list += "<tr>";
      list += "<th>" + sendList[key].clientName + "</th>";
      list += "<th>";
      for( let key2 in sendList[key].productsList){
        list += sendList[key].productsList[key2].name;
        list += " ( " + sendList[key].productsList[key2].quantity +" ) <br />";
      }
      list += "</th>";
      list += "<th> <button type='button' onclick=\'enviarPedido(\"" + sendList[key].id + "\")\'>"
      list += "PEDIDO ENTREGUE</button></th>";
      list += "</tr>";
    }
  
    putList("entregaPronta", list);
}

function enviarPedido(id){
    const date = new Date();
    let reference = "Pedidos/" + date.getFullYear() +"/" + (date.getMonth() + 1);
    reference += "/" + date.getDate() + "/" + id;

    sendList[id].withClient = true;
  
    firebase.database().ref(reference).set(sendList[id]);
    delete sendList[id];
    displaySendList();
}

function putSideDishCategoryList(productId){
    for( let key in sideDishList){
        if(sideDishList[key].sideDishCategory 
            == productsList[productId].sideDishCategory){
            sideDishCategoryList[sideDishList[key].category] =
                sideDishList[key].category;
        }
    }
}

function displaySideDishList(productId, cartId){
    putSideDishCategoryList(productId);
    let list = "";
    for (let key in sideDishCategoryList){
        list += "<h2>" + sideDishCategoryList[key] + "</h2>";
        list += "<table id='"+ sideDishCategoryList[key] +"'>";
         list += "<tr>";
        list += "<th> Produto </th>";
        list += "<th> Preço </th>";
        list += "<th> Descrição </th>";
        list += "<th> Quantidade </th>";
        list += "<th> Adicionar </th>";
        list += "</tr>";
        for(let key2 in sideDishList){
            list += "<tr>";
            if(sideDishList[key2].category == sideDishCategoryList[key]){
                list += "<th>" + sideDishList[key2].name + "</th>";
                list += "<th> R$ " + sideDishList[key2].pv.toFixed(2) + "</th>";
                list += "<th>" + sideDishList[key2].information + "</th>";
                list += "<th> <input type='number' value='1' min='1' max='99'" 
                list += " id='" + key2 + "'> </th>"; 
                list += "<th>"
                list += "<button type='button' onclick=\'addToSideDishCart(\"" +  cartId + "\",\""+key2 + "\")\'>"
                list += "<i class='glyphicon glyphicon-plus'></i></button>";
                list += "</th>"
            }
            list += "</tr>";
        }
        list += "</table>";
        list += "<br />";
    }
    putList('sideDishContent', list);
}

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
        list += "<th> Adicionar </th>";
        list += "</tr>";
        for(let key2 in productsList){
            list += "<tr>";
            if(productsList[key2].category == categoryList[key]){
                list += "<th>" + productsList[key2].name + "</th>";
                list += "<th> R$ " + productsList[key2].pv.toFixed(2) + "</th>";
                list += "<th>" + productsList[key2].information + "</th>";
                list += "<th> <input type='number' value='1' min='1' max='99'" 
                list += " id='" + key2 + "'> </th>"; 
                list += "<th>"
                list += "<button type='button' onclick=\'addToCart(\"" + key2 + "\")\'>"
                list += "<i class='glyphicon glyphicon-plus'></i></button>";
                list += "</th>"
            }
            list += "</tr>";
        }
        list += "</table>";
        list += "<br />";
    }
    putList('listaProdutos', list);
}

function showCartSize(){
    document.getElementById("cartSize").innerHTML = getListSize(cart);
}

function addToCart(id){
    let cartId = productsList[id].name + getUniqueID();
    cart[cartId] = new ProductSell(productsList[id].name,
        productsList[id].pv, productsList[id].information,
        getInputValue(productsList[id].name), {}, cartId);
    document.getElementById(productsList[id].name).value = 1;
    showCartSize();
    if(productsList[id].sideDish == "itHas"){
        openSideDish(id, cartId);
    }
}

function addToSideDishCart(cartId, sideDishId){
    cart[cartId].sideDishList[sideDishId] = new ProductSell(
            sideDishList[sideDishId].name,
             sideDishList[sideDishId].pv,
             sideDishList[sideDishId].information,
             getInputValue(sideDishId),
             {}, sideDishId
        );
}

function removeSideDishFromCart(cartId, sideDishId){
    delete cart[cartId].sideDishList[sideDishId];
    displayCartContent();
}

function comprar(){
    if(checarCompra()){
        const date = new Date();
        let id = userCurrent.displayName + getInputValue("clientName") + getUniqueID();
        let reference = "Pedidos/" + date.getFullYear() +"/" + (date.getMonth() + 1);
        reference += "/" + date.getDate() + "/" + id;

        let paymentTime = "";
        paymentTime += date.getDate() + ".." + (date.getMonth() + 1) +".." + date.getFullYear();
        paymentTime += " às " +  date.getHours() + ":";
        if(date.getMinutes() < 10){
            paymentTime += "0"
        } 
        paymentTime += date.getMinutes();

        let totalValue = 0;
        for(let key in cart){
            totalValue += cart[key].sellPrice();
        }

        let paymentType = {};
        paymentType["checar"] = new PaymentType("checar", 0);

        pedido[id] = new Pedidos(userCurrent.displayName,
            getInputValue("clientName"), paymentType,
             cart, paymentTime, totalValue, id, false, false);

        firebase.database().ref(reference).set(pedido[id]);
        document.getElementById("clientName").value = "";
        for(let key in cart){
            delete cart[key];
        }
        closeCart();
    }
}

function checarCompra(){
    if(getInputValue("clientName") == ""){
        window.alert("Nome do cliente está vazio");
        return false;
    }

    if(getListSize(cart) <= 0){
        window.alert("Carrinho está vazio");
        return false;
    }

    openCart();
    return true;
}

/*function testUniqueId(){
    let list = {};
    let id = "1";

    for(let i =0; i < 999999; i++){
        id = getUniqueID();
        if(list[id] != null){
            console.log ("ID: "+ id + "JÁ EXISTE")
        }
        list[id] = id;
    }

    console.log("FIM DO TEST");
    console.log(getListSize(list));

}

testUniqueId();*/