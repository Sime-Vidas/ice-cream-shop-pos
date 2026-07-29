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
const openHistoryButton = document.querySelector("#open-history");
const historyDialog = document.querySelector("#history-dialog");
const closeHistoryButton = document.querySelector("#close-history");
const historyList = document.querySelector("#history-list");
const saleDetailsDialog = document.querySelector("#sale-details-dialog");
const saleDetailsNumber = document.querySelector("#sale-details-number");
const saleDetailsDate = document.querySelector("#sale-details-date");
const saleDetailsPayment = document.querySelector("#sale-details-payment");
const saleDetailsStatus = document.querySelector("#sale-details-status");
const saleDetailsItems = document.querySelector("#sale-details-items");
const saleDetailsTotal = document.querySelector("#sale-details-total");
const closeSaleDetailsButton = document.querySelector(
    "#close-sale-details"
);
const backToHistoryButton = document.querySelector("#back-to-history");
const openStornoButton = document.querySelector("#open-storno");
const stornoDialog = document.querySelector("#storno-dialog");
const stornoReceiptNumber = document.querySelector(
    "#storno-receipt-number"
);
const cancelStornoButton = document.querySelector("#cancel-storno");
const confirmStornoButton = document.querySelector("#confirm-storno");

const openDailyTotalButton = document.querySelector(
    "#open-daily-total"
);
const dailyTotalDialog = document.querySelector(
    "#daily-total-dialog"
);
const closeDailyTotalButton = document.querySelector(
    "#close-daily-total"
);
const dailyTotalDate = document.querySelector("#daily-total-date");
const dailyTotalAmount = document.querySelector(
    "#daily-total-amount"
);
const dailyCashTotal = document.querySelector("#daily-cash-total");
const dailyCardTotal = document.querySelector("#daily-card-total");
const dailyReceiptCount = document.querySelector(
    "#daily-receipt-count"
);
const dailyStornoTotal = document.querySelector(
    "#daily-storno-total"
);

const openDailyHistoryButton = document.querySelector(
    "#open-daily-history"
);
const dailyHistoryDialog = document.querySelector(
    "#daily-history-dialog"
);
const closeDailyHistoryButton = document.querySelector(
    "#close-daily-history"
);
const dailyHistoryList = document.querySelector(
    "#daily-history-list"
);

const euroFormatter = new Intl.NumberFormat("hr-HR", {
    style: "currency",
    currency: "EUR"
});

const dateTimeFormatter = new Intl.DateTimeFormat("hr-HR", {
    dateStyle: "short",
    timeStyle: "short"
});

const dateFormatter = new Intl.DateTimeFormat("hr-HR", {
    dateStyle: "long"
});

const order = new Map();

let selectedSaleId = null;

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

async function loadSalesHistory() {
    historyList.innerHTML = `
        <p class="history-message">Učitavanje računa...</p>
    `;

    historyDialog.showModal();

    try {
        const response = await fetch("/api/sales");

        if (!response.ok) {
            throw new Error("Povijest računa nije se mogla učitati.");
        }

        const sales = await response.json();

        if (sales.length === 0) {
            historyList.innerHTML = `
                <p class="history-message">
                    Još nema spremljenih računa.
                </p>
            `;

            return;
        }

        historyList.innerHTML = "";

        for (const sale of sales) {
            const historyItem = document.createElement("button");
            historyItem.type = "button";
            historyItem.className = "history-item";

            const paymentMethod =
                sale.payment_method === "cash"
                    ? "Gotovina"
                    : "Kartica";

            const status =
                sale.status === "completed"
                    ? "Završen"
                    : "Storniran";

            historyItem.innerHTML = `
                <div class="history-item-main">
                    <strong>${sale.receipt_number}</strong>
                    <span>
                        ${dateTimeFormatter.format(new Date(sale.created_at))}
                    </span>
                </div>

                <div class="history-item-payment">
                    <span>${paymentMethod}</span>
                    <span
    class="history-status"
    data-status="${sale.status}"
>
    ${status}
</span>
                </div>

                <strong class="history-total">
                    ${euroFormatter.format(sale.total_cents / 100)}
                </strong>
            `;

            historyItem.addEventListener("click", () => {
                loadSaleDetails(sale.id);
            });

            historyList.appendChild(historyItem);
        }
    } catch (error) {
        historyList.innerHTML = `
            <p class="history-message history-error">
                ${error.message}
            </p>
        `;

        console.error(error);
    }
}

async function loadSaleDetails(saleId) {
    selectedSaleId = null;
    openStornoButton.hidden = true;

    saleDetailsNumber.textContent = "Učitavanje...";
    saleDetailsDate.textContent = "—";
    saleDetailsPayment.textContent = "—";
    saleDetailsStatus.textContent = "—";
    saleDetailsTotal.textContent = euroFormatter.format(0);

    saleDetailsItems.innerHTML = `
        <p>Učitavanje stavki...</p>
    `;

    historyDialog.close();
    saleDetailsDialog.showModal();

    try {
        const response = await fetch(`/api/sales/${saleId}`);
        const sale = await response.json();

        if (!response.ok) {
            throw new Error(
                sale.detail || "Detalji računa nisu se mogli učitati."
            );
        }

        saleDetailsNumber.textContent = sale.receipt_number;
        saleDetailsDate.textContent =
            dateTimeFormatter.format(new Date(sale.created_at));

        saleDetailsPayment.textContent =
            sale.payment_method === "cash"
                ? "Gotovina"
                : "Kartica";

        saleDetailsStatus.textContent =
            sale.status === "completed"
                ? "Završen"
                : "Storniran";

                saleDetailsStatus.dataset.status = sale.status;

        selectedSaleId = sale.id;
        openStornoButton.hidden = sale.status !== "completed";

        saleDetailsTotal.textContent =
            euroFormatter.format(sale.total_cents / 100);

        saleDetailsItems.innerHTML = "";

        for (const item of sale.items) {
            const itemElement = document.createElement("div");
            itemElement.className = "sale-details-item";

            itemElement.innerHTML = `
                <div>
                    <strong>${item.product_name}</strong>
                    <span>
                        ${item.quantity} ×
                        ${euroFormatter.format(
                item.unit_price_cents / 100
            )}
                    </span>
                </div>

                <strong>
                    ${euroFormatter.format(
                item.line_total_cents / 100
            )}
                </strong>
            `;

            saleDetailsItems.appendChild(itemElement);
        }
    } catch (error) {
        saleDetailsNumber.textContent = "Greška";

        saleDetailsItems.innerHTML = `
            <p class="history-error">${error.message}</p>
        `;

        console.error(error);
    }
}

async function confirmStorno() {
    if (selectedSaleId === null) {
        return;
    }

    const saleId = selectedSaleId;

    confirmStornoButton.disabled = true;
    confirmStornoButton.textContent = "Storniranje...";

    try {
        const response = await fetch(
            `/api/sales/${saleId}/storno`,
            {
                method: "POST"
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.detail || "Račun se nije mogao stornirati."
            );
        }

        stornoDialog.close();
        await loadSaleDetails(saleId);

    } catch (error) {
        window.alert(error.message);
        console.error(error);

    } finally {
        confirmStornoButton.disabled = false;
        confirmStornoButton.textContent = "Potvrdi storno";
    }
}

async function loadDailyTotal() {
    dailyTotalDate.textContent = "Učitavanje...";
    dailyTotalAmount.textContent = euroFormatter.format(0);
    dailyCashTotal.textContent = euroFormatter.format(0);
    dailyCardTotal.textContent = euroFormatter.format(0);
    dailyReceiptCount.textContent = "0";
    dailyStornoTotal.textContent =
        `${euroFormatter.format(0)} · 0 računa`;

    dailyTotalDialog.showModal();

    try {
        const response = await fetch("/api/reports/today");
        const report = await response.json();

        if (!response.ok) {
            throw new Error(
                report.detail ||
                "Dnevni promet nije se mogao učitati."
            );
        }

        const reportDate = new Date(
            `${report.date}T00:00:00`
        );

        dailyTotalDate.textContent =
            dateFormatter.format(reportDate);

        dailyTotalAmount.textContent =
            euroFormatter.format(report.total_cents / 100);

        dailyCashTotal.textContent =
            euroFormatter.format(report.cash_total_cents / 100);

        dailyCardTotal.textContent =
            euroFormatter.format(report.card_total_cents / 100);

        dailyReceiptCount.textContent =
            String(report.receipt_count);

        dailyStornoTotal.textContent = `
            ${euroFormatter.format(
                report.storned_total_cents / 100
            )} · ${report.storned_receipt_count} računa
        `.trim();

    } catch (error) {
        dailyTotalDialog.close();
        window.alert(error.message);
        console.error(error);
    }
}

async function loadDailyHistory() {
    dailyHistoryList.innerHTML = `
        <p class="history-message">
            Učitavanje dnevnih izvještaja...
        </p>
    `;

    dailyTotalDialog.close();
    dailyHistoryDialog.showModal();

    try {
        const response = await fetch("/api/reports/daily");
        const reports = await response.json();

        if (!response.ok) {
            throw new Error(
                reports.detail ||
                "Povijest prometa nije se mogla učitati."
            );
        }

        if (reports.length === 0) {
            dailyHistoryList.innerHTML = `
                <p class="history-message">
                    Još nema dnevnih izvještaja.
                </p>
            `;

            return;
        }

        dailyHistoryList.innerHTML = "";

        for (const report of reports) {
            const reportDate = new Date(
                `${report.date}T00:00:00`
            );

            const reportItem = document.createElement("article");
            reportItem.className = "daily-history-item";

            reportItem.innerHTML = `
                <header class="daily-history-item-header">
                    <strong>
                        ${dateFormatter.format(reportDate)}
                    </strong>

                    <strong class="daily-history-total">
                        ${euroFormatter.format(
                            report.total_cents / 100
                        )}
                    </strong>
                </header>

                <dl class="daily-history-breakdown">
                    <div>
                        <dt>Gotovina</dt>
                        <dd>
                            ${euroFormatter.format(
                                report.cash_total_cents / 100
                            )}
                        </dd>
                    </div>

                    <div>
                        <dt>Kartica</dt>
                        <dd>
                            ${euroFormatter.format(
                                report.card_total_cents / 100
                            )}
                        </dd>
                    </div>

                    <div>
                        <dt>Računi</dt>
                        <dd>${report.receipt_count}</dd>
                    </div>

                    <div>
                        <dt>Stornirano</dt>
                        <dd class="daily-history-storno">
                            ${euroFormatter.format(
                                report.storned_total_cents / 100
                            )}
                            · ${report.storned_receipt_count}
                        </dd>
                    </div>
                </dl>
            `;

            dailyHistoryList.appendChild(reportItem);
        }

    } catch (error) {
        dailyHistoryList.innerHTML = `
            <p class="history-message history-error">
                ${error.message}
            </p>
        `;

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

openHistoryButton.addEventListener("click", () => {
    loadSalesHistory();
});

closeHistoryButton.addEventListener("click", () => {
    historyDialog.close();
});

closeSaleDetailsButton.addEventListener("click", () => {
    saleDetailsDialog.close();
});

backToHistoryButton.addEventListener("click", () => {
    saleDetailsDialog.close();
    loadSalesHistory();
});

openStornoButton.addEventListener("click", () => {
    if (selectedSaleId === null) {
        return;
    }

    stornoReceiptNumber.textContent =
        saleDetailsNumber.textContent;

    saleDetailsDialog.close();
    stornoDialog.showModal();
});

cancelStornoButton.addEventListener("click", () => {
    const saleId = selectedSaleId;

    stornoDialog.close();

    if (saleId !== null) {
        loadSaleDetails(saleId);
    }
});

confirmStornoButton.addEventListener("click", () => {
    confirmStorno();
});

openDailyTotalButton.addEventListener("click", () => {
    loadDailyTotal();
});

closeDailyTotalButton.addEventListener("click", () => {
    dailyTotalDialog.close();
});

openDailyHistoryButton.addEventListener("click", () => {
    loadDailyHistory();
});

closeDailyHistoryButton.addEventListener("click", () => {
    dailyHistoryDialog.close();
});

loadProducts();