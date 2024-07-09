const roleElement = document.getElementById("role");
const emailElement = document.getElementById("email");

const role = roleElement && roleElement.textContent.trim();
const email = emailElement && emailElement.textContent.trim();

const socket = io(); 

socket.on("products", (data) => {
    productsRender(data);
});

// Renderizado de productos
const productsRender = (products) => {
    const productsContainer = document.getElementById("productsContainer");
    productsContainer.innerHTML = "";

    const row = document.createElement("div");
    row.classList.add("row");

    products.docs.forEach(item => {
        // Filtrar productos para usuarios premium
        if (role === "premium" && item.owner !== email) {
            return; // Saltar este producto si no es del usuario premium
        }

        const card = document.createElement("div");
        card.classList.add("card", "real-time-card", "col-12", "col-sm-6", "col-md-4", "col-lg-3", "mb-3");

        card.innerHTML = `
        <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
            <p class="card-text">Precio: ${item.price}</p>
            <button class="btn btn-danger">Eliminar</button>
        </div>
    `;

        row.appendChild(card);

        // Evento para boton eliminar
        card.querySelector("button").addEventListener("click", () => {
            if (role === "premium" && item.owner === email) {
                deleteProduct(item._id);
            } else if (role === "admin") {
                deleteProduct(item._id);
            } else {
                Swal.fire({
                    title: "Error",
                    text: "No tiene permiso para eliminar este producto", 
                });
            }
        });
    });

    productsContainer.appendChild(row);
};

// Eliminar producto
const deleteProduct = (id) => {
    socket.emit("deleteProduct", id);
};

// Agregar productos desde el form
document.getElementById("btnSend").addEventListener("click", (event) => {
    event.preventDefault();
    addProduct();
});

const addProduct = () => {
    const owner = role === "premium" ? email : "admin";

    const product = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        code: document.getElementById("code").value,
        price: document.getElementById("price").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        img: document.getElementById("img").value,
        status: document.getElementById("status").value === "true",
        owner
    };

    socket.emit("addProduct", product);

    // Limpiar los campos del formulario
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("code").value = "";
    document.getElementById("price").value = "";
    document.getElementById("stock").value = "";
    document.getElementById("category").value = "";
    document.getElementById("img").value = "";
    document.getElementById("status").value = "true"; // Restaurar valor por defecto
};
