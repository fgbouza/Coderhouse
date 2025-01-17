let urlConversor = "https://api.bluelytics.com.ar/v2/latest";

var cotUsd;
//La idea del proyecto es obtener estos dos valores en tiempo real por alguna API
var cotEur;

fetch(urlConversor)
    .then( (resp) => resp.json() )
    .then( (data) => cotUsd = parseFloat(data.blue.value_sell) );

fetch(urlConversor)
    .then( (resp) => resp.json() )
    .then( (data) => cotEur = parseFloat(data.blue_euro.value_sell) );

const ars2Usd = p => parseFloat(p / cotUsd);
const ars2Eur = p => parseFloat(p / cotEur);

let nombreProducto = "";
let descripcionProducto = "";
let precio = 0;
let lastProdId = 0;
let productos = [];

let btnEnter = document.getElementById("btnEnter");
let btnUserName = document.getElementById("btnUserName");
let header = document.getElementById("headerPage");
let container = document.getElementById("listProd");

let flagEntrada = localStorage.getItem('flagEntrada');
let arrayProds = localStorage.getItem('arrayProds');
let nombreUser = localStorage.getItem('nombreUser');


if(flagEntrada){
    header.innerText = "Bienvenido/a " + nombreUser
    productos = JSON.parse(arrayProds);
    if(productos != null)cargarProductos(productos);
} 
else{
    nombreUser = "";
    localStorage.setItem('nombreUser', nombreUser);
    localStorage.setItem('arrayProds', JSON.stringify(productos));
    header.innerText = "Bienvenido/a " + nombreUser;
}

btnEnter.onclick = () => {
    main();
}

btnUserName.onclick = () => {
    cambiarUserName();
}

class Producto
{
    constructor(Id, nombreProducto, descripcionProducto, precio)
    {
        this.Id = Id;
        this.nombre = nombreProducto;
        this.descripcion = descripcionProducto;
        this.precio = precio;
    }
    setIva()
    {
        this.precio = this.precio + this.precio * 0.21;
    }
}

function cargarProductos(productos)
{
    for(const prod of productos)
    {
        imprimirProducto(prod, container);
    }
}

function entrada()
{
    let nameProd = document.getElementById("inputNameProd");
    let descProd = document.getElementById("inputDescProd");
    let priceProd = document.getElementById("inputPriceProd");
    let ingresoExitoso = true;

    ingresoString("NameProd", nameProd.value) ? nombreProducto = nameProd.value : ingresoExitoso = false;

    ingresoString("DescProd", descProd.value) ? descripcionProducto = descProd.value : ingresoExitoso = false;

    ingresoInt("PriceProd", priceProd.value) ? precio = parseInt(priceProd.value) : ingresoExitoso = false;
    lastProdId = productos.length > 0 ? productos[productos.length-1].Id : 0;
    return ingresoExitoso ? new Producto(lastProdId + 1, nombreProducto, descripcionProducto, precio) : null;
}

function ingresoString(nombreDato, salida)
{
    let flag = false;
    let errorTag = document.getElementById("error"+nombreDato);
    if(salida != "" && salida != null) 
    {
        flag = true;
        errorTag.toggleAttribute("hidden", true);
    }else 
    {
        errorTag.toggleAttribute("hidden", false);
        flag = false;
    }
    return flag;
}
function ingresoInt(nombreDato, salida)
{
    let flag = true;
    let errorTag = document.getElementById("error"+nombreDato);
    if(isNaN(parseInt(salida)) || parseInt(salida) <= 0)
    {
        errorTag.toggleAttribute("hidden", false);
        flag = false;
    }else{
        errorTag.toggleAttribute("hidden", true);
    }
    return flag;
}

function imprimirProducto(producto, htmlId)
{
    const {Id, nombre, descripcion, precio} = producto;
    htmlId.innerHTML += "<div id = 'prod"+ Id +"'>"
    +"<h3>Producto ID:"+ Id +"</h3>"
    +"<p><strong>Nombre del producto: "+ nombre +"</strong></p>"
    +"<p><strong>Descripción: "+ descripcion +"</strong></p>"
    +"<p><strong>Precio final: $"+ Math.round(precio).toFixed(2) +"</strong></p>"
    +"<p><strong>Cotización en U$D: $"+ Math.round(ars2Usd(precio)).toFixed(2) +"</strong></p>"
    +"<p><strong>Cotizacion en Euro: €"+ Math.round(ars2Eur(precio)).toFixed(2) +"</strong></p>"
    +"</div><br/>"
}

function cambiarUserName()
{
    let ingresoExitoso = true;
    let userName = document.getElementById("inputUserName");

    if(!ingresoString("UserName", userName.value)) ingresoExitoso = false;

    if(ingresoExitoso)
    {
        localStorage.setItem('flagEntrada', true);
        localStorage.setItem('nombreUser', userName.value);
        header.innerText = "Bienvenido/a "+  userName.value;
        Toastify({
            text: "Nombre de usuario cambiado exitosamente a "+ userName.value+".\n Recargar la página para que sea válido",
            duration: 3000
        }).showToast();
    }
}
function main(){
    
    let resIva = document.getElementById("inputIvaProd");
    
    let productoIngresado = entrada();
    if(productoIngresado != null)
    {
        resIva.checked ? productoIngresado.setIva() : true;
        imprimirProducto(productoIngresado, container);
        productos.push(productoIngresado);
        localStorage.setItem("arrayProds", JSON.stringify(productos));
        Toastify({
            text: "Producto ingresado correctamente",
            duration: 2000
        }).showToast();
    }
}
