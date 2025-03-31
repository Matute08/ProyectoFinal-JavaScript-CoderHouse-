//LOGIN
// window.addEventListener('load', ()=>{
//     Swal.fire({
//         title: 'INICIAR SESION',
//         html: `<input type="text" id="login" class="swal2-input" placeholder="Username">
//                 <input type="password" id="password" class="swal2-input" placeholder="Password">`,
//         confirmButtonText: 'Inciar sesion',
//         focusConfirm: false,
//         backdrop:'#7e0037',
//         allowOutsideClick: false,
//         preConfirm: () => {
//             const login = Swal.getPopup().querySelector('#login').value
//             const password = Swal.getPopup().querySelector('#password').value
            
//           if (!login || !password) {
//             Swal.showValidationMessage(`Por favor complete los campos`)
//           }
//         }
//     }).then((resultado)=>{
//         if (resultado.isConfirmed){
//             Swal.fire({
//                 title: 'Bienvenido!!',
//                 icon: 'success',
//                 confirmButtonText: 'Aceptar',
//                 backdrop:'#7e0037',
//             })
//         }
//     })
// })
//ARREGLO DE PRODUCTOS
let arrayProductos=[];

//ARREGLO DEL CARRITO 
let carrito = [];

//CARGAR CARRITO DESDE LOCALSTORAGE
if (localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"));
}


//FUNCION PARA CARGAR LOS PRODUCTOS
const contenedorProductos = document.getElementById("contenedor-productos");
const listadoProductos = "../json/producto.json";

fetch(listadoProductos)
    .then(respuesta => respuesta.json())
    .then(datos => {
        arrayProductos = datos;
        arrayProductos.forEach(({ id, url, nombre, precio }) => {
            const div = document.createElement("div");
            div.className = "card col d-flex justify-content-center align-items-center";
            div.innerHTML = `
                <div id="carouselExampleFade" class="carousel slide carousel-fade">
                    <div class="carousel-inner imagenes">
                        <div class="carousel-item active">
                            <img src="${url}" class="d-block w-100" alt="${nombre}">
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <h5 class="card-title text-center" id="titulo-card">${nombre}</h5>
                    <div class="price text-center">
                        <p class="precio-card"> $${precio}</p>
                    </div>
                    <div class="boton text-center">
                        <a href="#" class="btn btn-primary boton-agregar-carrito" id="boton-card${id}">Agregar al Carrito</a>
                    </div>
                </div>
            `;
            contenedorProductos.appendChild(div);

            document.getElementById(`boton-card${id}`).addEventListener("click", () => agregarAlCarrito(id));
        });
    })
    .catch(console.error);

//FUNCION PARA CARGAR EL CARRITO
const agregarAlCarrito = (id) =>{
     const productoEnCarrito = carrito.find(producto => producto.id ===id);
     if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
     }else{
        const producto = arrayProductos.find(producto =>producto.id===id)
        carrito.push(producto);

        console.log(arrayProductos)
        console.log(carrito) 
     }

     calcularTotal()
     localStorage.setItem("carrito",JSON.stringify(carrito));
}

//FUNCION PARA MOSTRAR EL CARRITO
const contenedorCarrito = document.getElementById("contenedor-carrito");
const btnMostrarCarrito = document.getElementById("boton-carrito");

btnMostrarCarrito.addEventListener("click", () =>{
    mostrarCarrito();
})

const mostrarCarrito= () =>{
    //con esto lo que logramos es que no se genere la duplicacion de contenido.
    contenedorCarrito.innerHTML = "";

    carrito.forEach(producto =>{

        const div = document.createElement("div");
        div.innerHTML = `
        <div class="container">
            <div class="row datos-carrito">
                <div class= "col-4">${producto.nombre}</div>
                <div class= "col-3">${producto.cantidad}</div>
                <div class= "col-3">${producto.precio * producto.cantidad}</div>
                <div class= "col-1 " id="agregar-producto${producto.id}">
                    <button><i class="fas fa-plus agregar-producto"></i></button>
                </div>
                <div class= "col-1 " id="eliminar-producto${producto.id}">
                    <button><i class="fas fa-times eliminar-producto"></i></button>
                </div>
            </div>
        </div>
        `;
        contenedorCarrito.appendChild(div);

        //ELIMINAR PRODUCTOS DEL CARRITO
        const botonEliminar = document.getElementById(`eliminar-producto${producto.id}`);
        botonEliminar.addEventListener("click", ()=>{
            eliminarDelCarrito(producto.id);
        })

        //SUMAR PRODUCTO AL CARRITO
        const botonSumarProducto = document.getElementById(`agregar-producto${producto.id}`);
        botonSumarProducto.addEventListener("click", () =>{
            sumarProductoCarrito(producto.id)
        })
    })
    calcularTotal();
}

//FUNCION QUE ELIMINA EL PRODUCTO DEL CARRITO
const eliminarDelCarrito = (id) =>{
    const producto = carrito.find(producto => producto.id === id);
    const indice = carrito.indexOf(producto);
    producto.cantidad--;
    if (producto.cantidad == 0) {
        carrito.splice(indice, 1);
    }
    mostrarCarrito();

    localStorage.setItem("carrito",JSON.stringify(carrito));
}

const sumarProductoCarrito = (id) =>{
    const producto = carrito.find(producto => producto.id ===id);
    producto.cantidad++;
    mostrarCarrito();

    localStorage.setItem("carrito",JSON.stringify(carrito));

}

//VACIAMOS CARRITO COMPLETO
const vaciarCarrito = document.getElementById("eliminar-carrito");

vaciarCarrito.addEventListener("click", () =>{
    eliminarTodoElCarrito();
})

//FUNCION PARA VACIAR CARRITO COMPLETO
const eliminarTodoElCarrito = () =>{
    contenedorCarrito.innerHTML = "";
    carrito = [];
    mostrarCarrito();

    localStorage.clear();
}

//MOSTRAR TOTAL COMPRA
const total = document.getElementById("total");
const calcularTotal = () =>{
    let totalCompra = 0;
    carrito.forEach(producto => {
        totalCompra += producto.precio * producto.cantidad;
    })
    if (carrito == "") {
    total.innerHTML = `El carrito esta vacio`;
    }else
    {
        total.innerHTML = `El total de la compra es de $${totalCompra}`;
    }
}

//PAGAR COMPRA - FUNCIONALIDAD CARD

const btnPagar = document.getElementById("btn-pagar");
const btnCerrar = document.getElementById("btn-cerrar");

const nameCard = document.getElementById('name');
const cardnumber = document.getElementById('cardnumber');
const expirationdate = document.getElementById('expirationdate');
const securitycode = document.getElementById('securitycode');

btnPagar.addEventListener('click', ()=>{
    
    //EVENTOS INPUT
    nameCard.addEventListener('input', function () {
        if (nameCard.value.length == 0) {
            document.getElementById('svgname').innerHTML = 'Homero Simpson';
            document.getElementById('svgnameback').innerHTML = 'Homero Simpson';
        } else {
            document.getElementById('svgname').innerHTML = this.value;
            document.getElementById('svgnameback').innerHTML = this.value;
        }
    });
    cardnumber.addEventListener('input', function(){
        if (cardnumber.value.length ==0) {
            document.getElementById('svgnumber').innerHTML = '0123 4567 8910 1112';
        } else{
            document.getElementById('svgnumber').innerHTML = this.value;
        }
    })

    expirationdate.addEventListener('input', function(){
        if (expirationdate.value.length ==0) {
            document.getElementById('svgexpire').innerHTML = '01/24';
        } else{
            document.getElementById('svgexpire').innerHTML = this.value;
        }
    })

    securitycode.addEventListener('input', function(){
        if (securitycode.value.length == 0) {
            document.getElementById('svgsecurity').innerHTML = '985';
        } else{
            document.getElementById('svgsecurity').innerHTML = this.value;
        }
    })
    
    //EVENTO FOCUS
    nameCard.addEventListener('focus', function () {
        document.querySelector('.creditcard').classList.remove('flipped');
    });
    
    cardnumber.addEventListener('focus', function () {
        document.querySelector('.creditcard').classList.remove('flipped');
    });
    
    expirationdate.addEventListener('focus', function () {
        document.querySelector('.creditcard').classList.remove('flipped');
    });
    
    securitycode.addEventListener('focus', function () {
        document.querySelector('.creditcard').classList.add('flipped');
    });

});


//CONFIRMACION COMPRA

const btnConfirmar = document.getElementById("btn-confirmar-compra");

btnConfirmar.addEventListener('click', ()=>{
    if (nameCard.value.length == 0 || cardnumber.value.length== 0 || expirationdate.value.length ==0 || securitycode.value.length == 0) {
        Swal.fire({
            icon: 'error',
            title: 'Error!!',
            text: 'Complete todos los datos requeridos',
          })
    }else{
        Swal.fire({
            title: '¿Estas seguro de realizar la compra?',
            icon: 'question',
            showDenyButton: true,
            confirmButtonText: 'Si',
            denyButtonText: `No`,

            
        }).then((result) => {
            if (result.isConfirmed) {
            Swal.fire({
                title: 'Compra realizada con exito!',
                timer: 1200,
                showConfirmButton: false,
                timerProgressBar: true,
                icon: 'success'
            })


            } else if (result.isDenied) {
                Swal.fire({
                    title: 'Compra cancelada',
                    icon: 'info',
                    timer:1200,
                    timerProgressBar:true,
                    showConfirmButton:false

                })
            }
        })
    }
})

