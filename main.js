const container = document.querySelector('#serviceBoxContainer');
const searchInput = document.querySelector('#searchConge1');
const precioFilter = document.querySelector('#precioFilter');
const unitFilter = document.querySelector('#unitFilter');
const categoFilter = document.querySelector('#categoFilter');
const nameFilter = document.querySelector('#nameFilter');
const btnShop = document.querySelector('#btnShop');
const btndelete=document.querySelector('#trashIcon')


fetch('productos.json')
  .then(response => response.json())
  .then(data => {
    products = data;
    renderProducts();
  })
  .catch(error => console.error(error));

  function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    let filteredProducts = products.filter(product => 
      (precioFilter.checked && product.precio.toLowerCase().includes(searchTerm)) ? true
      : (unitFilter.checked && product.unidades.toLowerCase().includes(searchTerm)) ? true
      : (categoFilter.checked && product.categoria.toLowerCase().includes(searchTerm)) ? true
      : (nameFilter.checked && product.nombre.toLowerCase().includes(searchTerm)) ? true
      : false
    );
    return filteredProducts;
  }

function renderProducts() {
  const filteredProducts = filterProducts();
  container.innerHTML = '';
  filteredProducts.forEach(product => {
    const serviceBox = document.createElement('div');
    serviceBox.classList.add('col-lg-4', 'col-md-6');
    serviceBox.innerHTML = `
      <div class="service-box">
        <div class="service-icon mb-3">
          <img class="img-fluid w-35" src="${product.img}" alt="${product.nombre}">
        </div>
        <div class="service-content mb-3">
          <h3>${product.nombre}</h3>
          <p>${product.descripcion}</p>
          <label for="price">Precio:</label>
          <span id="precio"><strong>${product.precio}</strong></span><br>
          <label for="units">Unidades:</label>
          <span id="unidades"><strong>${product.unidades}</strong></span><br>
          <label for="category">Categoría:</label>
          <span id="categoria"><strong>${product.categoria}</strong></span><br>
          <button type="button" class="btn btn-outline-secondary" id="agregar">Agregar</button>
          <span<i class="fas fa-minus	" id="trashIcon"></i><strong></strong>

        </div>
      </div>
    `;
    container.appendChild(serviceBox);
  });
}

let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
btnShop.textContent = '('+ cartItems.length.toString() + ')';

container.addEventListener('click', (event) => {
  if (event.target.id === 'agregar') {
    const productElement = event.target.closest('.service-box');
    const product = {
      nombre: productElement.querySelector('h3').textContent,
      precio: productElement.querySelector('#precio strong').textContent,
      unidades: productElement.querySelector('#unidades strong').textContent,
      categoria: productElement.querySelector('#categoria strong').textContent,
    };
    cartItems.push(product);
    btnShop.textContent = '('+ cartItems.length.toString() + ')';
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Return a Promise when a product is added to the cart
    return new Promise((resolve) => {
      resolve(product);
    });
  } else if (event.target.id === 'trashIcon') {
    const productElement = event.target.closest('.service-box');
    const productName = productElement.querySelector('h3').textContent;
    const index = cartItems.findIndex(product => product.nombre === productName);
    if (index !== -1) {
      const removedProduct = cartItems.splice(index, 1)[0];
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      btnShop.textContent = '('+ cartItems.length.toString() + ')';
      
      // Return a Promise when a product is removed from the cart
      return new Promise((resolve) => {
        resolve(removedProduct);
      });
    }
  }
});

//Usar Sweet Alert en el carrito de compras

btnShop.addEventListener('click',() =>{
    Swal.fire({
        title: 'Queres pagar los productos',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Sí',
        denyButtonText: `Seguir comprando`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          Swal.fire('Comprar', '', 'Gracias')
        } else if (result.isDenied) {
          Swal.fire('Podes seguir añadiendo', '', 'info')
        }
      })
})


searchInput.addEventListener('input', renderProducts);
precioFilter.addEventListener('change', renderProducts);
unitFilter.addEventListener('change', renderProducts);
categoFilter.addEventListener('change', renderProducts);
nameFilter.addEventListener('change', renderProducts);




