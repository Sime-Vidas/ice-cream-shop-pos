const productsContainer = document.querySelector("#products");
const orderItemsContainer = document.querySelector("#order-items");
const totalElement = document.querySelector("#total");
const clearOrderButton = document.querySelector("#clear-order");
const paymentButtons = document.querySelectorAll(".payment-buttons button");
const receiptDialog = document.querySelector("#receipt-dialog");
const receiptNumberElement = document.querySelector("#receipt-number");
const receiptPaymentElement = document.querySelector("#receipt-payment");
const receiptTotalElement = document.querySelector("#receipt-total");
const closeReceiptButton = document.querySelector("#close-receipt");

const euroFormatter = new Intl.NumberFormat("hr-HR", {
    style: "currency",
    currency: "EUR"
});

const order = new Map();


function addProductToOrder(product) {
    const existingItem = order.get(product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        order.set(product.id, {
            ...product,
            quantity: 1
        });
    }

    renderOrder();
}


function renderOrder() {
    if (order.size === 0) {
        orderItemsContainer.innerHTML = `
            <p class="empty-order">Račun je prazan.</p>
        `;

        totalElement.textContent = euroFormatter.format(0);

        for (const button of paymentButtons) {
            button.disabled = true;
        }

        return;
    }

    orderItemsContainer.innerHTML = "";

    let totalCents = 0;

    for (const item of order.values()) {
        const lineTotalCents = item.price_cents * item.quantity;
        totalCents += lineTotalCents;

        const orderItem = document.createElement("div");
        orderItem.className = "order-item";

                orderItem.innerHTML = `
            <div>
                <strong>${item.name}</strong>
                <span>${euroFormatter.format(item.price_cents / 100)} po komadu</span>
            </div>

            <div class="quantity-controls">
                <button
                    type="button"
                    data-action="decrease"
                    data-product-id="${item.id}"
                    aria-label="Smanji količinu"
                >
                    −
                </button>

                <span>${item.quantity}</span>

                <button
                    type="button"
                    data-action="increase"
                    data-product-id="${item.id}"
                    aria-label="Povećaj količinu"
                >
                    +
                </button>
            </div>

            <strong>${euroFormatter.format(lineTotalCents / 100)}</strong>
        `;

        orderItemsContainer.appendChild(orderItem);
    }

    totalElement.textContent = euroFormatter.format(totalCents / 100);

    for (const button of paymentButtons) {
        button.disabled = false;
    }
}

async function completeSale(paymentMethod) {
    const items = Array.from(order.values()).map((item) => {
        return {
            product_id: item.id,
            quantity: item.quantity
        };
    });

    for (const button of paymentButtons) {
        button.disabled = true;
    }

    try {
        const response = await fetch("/api/sales", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                payment_method: paymentMethod,
                items: items
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.detail || "Račun se nije mogao spremiti."
            );
        }

                receiptNumberElement.textContent = result.receipt_number;

        receiptPaymentElement.textContent =
            result.payment_method === "cash"
                ? "Gotovina"
                : "Kartica";

        receiptTotalElement.textContent =
            euroFormatter.format(result.total_cents / 100);

        receiptDialog.showModal();

        order.clear();
        renderOrder();

    } catch (error) {
        window.alert(error.message);
        renderOrder();
        console.error(error);
    }
}

async function loadProducts() {
    try {
        const response = await fetch("/api/products");

        if (!response.ok) {
            throw new Error("Proizvodi se nisu mogli učitati.");
        }

        const products = await response.json();

        productsContainer.innerHTML = "";

        for (const product of products) {
            const productButton = document.createElement("button");

            productButton.type = "button";
            productButton.className = "product-button";

            productButton.innerHTML = `
                <span>${product.name}</span>
                <strong>${euroFormatter.format(product.price_cents / 100)}</strong>
            `;

            productButton.addEventListener("click", () => {
                addProductToOrder(product);
            });

            productsContainer.appendChild(productButton);
        }
    } catch (error) {
        productsContainer.innerHTML = `
            <p>Dogodila se greška prilikom učitavanja proizvoda.</p>
        `;

        console.error(error);
    }
}

orderItemsContainer.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");

    if (!button) {
        return;
    }

    const productId = Number(button.dataset.productId);
    const item = order.get(productId);

    if (!item) {
        return;
    }

    if (button.dataset.action === "increase") {
        item.quantity += 1;
    }

    if (button.dataset.action === "decrease") {
        item.quantity -= 1;

        if (item.quantity === 0) {
            order.delete(productId);
        }
    }

    renderOrder();
});

clearOrderButton.addEventListener("click", () => {
    order.clear();
    renderOrder();
});

for (const button of paymentButtons) {
    button.addEventListener("click", () => {
        completeSale(button.dataset.paymentMethod);
    });
}

closeReceiptButton.addEventListener("click", () => {
    receiptDialog.close();
});

loadProducts();