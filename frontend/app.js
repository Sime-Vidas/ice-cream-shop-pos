const productsContainer = document.querySelector("#products");
const orderItemsContainer = document.querySelector("#order-items");
const totalElement = document.querySelector("#total");
const clearOrderButton = document.querySelector("#clear-order");
const paymentButtons = document.querySelectorAll(".payment-buttons button");
const receiptDialog = document.querySelector("#receipt-dialog");
const receiptNumberElement = document.querySelector("#receipt-number");
const receiptPaymentElement = document.querySelector("#receipt-payment");
const receiptTotalElement = document.querySelector("#receipt-total");
const receiptCashReceivedRow = document.querySelector(
    "#receipt-cash-received-row"
);
const receiptCashReceived = document.querySelector(
    "#receipt-cash-received"
);
const receiptChangeRow = document.querySelector(
    "#receipt-change-row"
);
const receiptChange = document.querySelector("#receipt-change");
const receiptEmployee = document.querySelector(
    "#receipt-employee"
);
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
const saleDetailsCashReceivedRow = document.querySelector(
    "#sale-details-cash-received-row"
);
const saleDetailsCashReceived = document.querySelector(
    "#sale-details-cash-received"
);
const saleDetailsChangeRow = document.querySelector(
    "#sale-details-change-row"
);
const saleDetailsChange = document.querySelector(
    "#sale-details-change"
);
const saleDetailsEmployee = document.querySelector(
    "#sale-details-employee"
);
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

const INACTIVITY_TIMEOUT_MS = 5 * 60 * 1000;

const cashPaymentDialog = document.querySelector(
    "#cash-payment-dialog"
);
const closeCashPaymentButton = document.querySelector(
    "#close-cash-payment"
);
const cancelCashPaymentButton = document.querySelector(
    "#cancel-cash-payment"
);
const confirmCashPaymentButton = document.querySelector(
    "#confirm-cash-payment"
);
const cashAmountDue = document.querySelector("#cash-amount-due");
const cashReceivedDisplay = document.querySelector(
    "#cash-received-display"
);
const cashChangeDisplay = document.querySelector(
    "#cash-change-display"
);
const cashQuickButtons = document.querySelectorAll(
    "[data-cash-quick]"
);
const cashKeypad = document.querySelector(".cash-keypad");

const currentEmployeeButton = document.querySelector(
    "#current-employee"
);
const currentEmployeeName = document.querySelector(
    "#current-employee-name"
);
const loginDialog = document.querySelector("#login-dialog");
const pinDisplay = document.querySelector("#pin-display");
const loginError = document.querySelector("#login-error");
const loginKeypad = document.querySelector(".login-keypad");
const loginButton = document.querySelector("#login-button");

const currentShiftButton = document.querySelector(
    "#current-shift"
);
const openShiftDialog = document.querySelector(
    "#open-shift-dialog"
);
const openingCashDisplay = document.querySelector(
    "#opening-cash-display"
);
const openingCashQuickButtons = document.querySelectorAll(
    "[data-opening-cash-quick]"
);
const openingCashKeypad = document.querySelector(
    ".opening-cash-keypad"
);
const openShiftError = document.querySelector(
    "#open-shift-error"
);
const confirmOpenShiftButton = document.querySelector(
    "#confirm-open-shift"
);
const shiftDialog = document.querySelector("#shift-dialog");
const shiftDialogTitle = document.querySelector(
    "#shift-dialog-title"
);
const closeShiftDialogButton = document.querySelector(
    "#close-shift-dialog"
);
const shiftOpenedBy = document.querySelector("#shift-opened-by");
const shiftOpenedAt = document.querySelector("#shift-opened-at");
const shiftOpeningCash = document.querySelector(
    "#shift-opening-cash"
);
const shiftCashSales = document.querySelector(
    "#shift-cash-sales"
);
const shiftCardSales = document.querySelector(
    "#shift-card-sales"
);
const shiftReceiptCount = document.querySelector(
    "#shift-receipt-count"
);
const shiftExpectedCash = document.querySelector(
    "#shift-expected-cash"
);
const startCloseShiftButton = document.querySelector(
    "#start-close-shift"
);
const closeShiftConfirmationDialog = document.querySelector(
    "#close-shift-confirmation-dialog"
);
const closingCashDisplay = document.querySelector(
    "#closing-cash-display"
);
const closingCashKeypad = document.querySelector(
    ".closing-cash-keypad"
);
const closeShiftError = document.querySelector(
    "#close-shift-error"
);
const cancelCloseShiftButton = document.querySelector(
    "#cancel-close-shift"
);
const confirmCloseShiftButton = document.querySelector(
    "#confirm-close-shift"
);

const order = new Map();

let selectedSaleId = null;

let cashAmountDueCents = 0;
let cashReceivedCents = 0;

let currentEmployee = null;
let enteredPin = "";

let inactivityTimer = null;

let currentShift = null;
let openingCashCents = 0;
let closingCashCents = 0;

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

function getOrderTotalCents() {
    let totalCents = 0;

    for (const item of order.values()) {
        totalCents += item.price_cents * item.quantity;
    }

    return totalCents;
}


function updateCashPayment() {
    const changeCents = Math.max(
        cashReceivedCents - cashAmountDueCents,
        0
    );

    cashAmountDue.textContent =
        euroFormatter.format(cashAmountDueCents / 100);

    cashReceivedDisplay.textContent =
        euroFormatter.format(cashReceivedCents / 100);

    cashChangeDisplay.textContent =
        euroFormatter.format(changeCents / 100);

    confirmCashPaymentButton.disabled =
        cashReceivedCents < cashAmountDueCents;
}


function openCashPayment() {
    cashAmountDueCents = getOrderTotalCents();
    cashReceivedCents = 0;

    updateCashPayment();
    cashPaymentDialog.showModal();
}

function handleCashKey(key) {
    if (key === "clear") {
        cashReceivedCents = 0;
        updateCashPayment();
        return;
    }

    if (key === "backspace") {
        cashReceivedCents = Math.floor(
            cashReceivedCents / 10
        );

        updateCashPayment();
        return;
    }

    const digit = Number(key);

    if (!Number.isInteger(digit)) {
        return;
    }

    const nextAmount = cashReceivedCents * 10 + digit;

    if (nextAmount > 9999999) {
        return;
    }

    cashReceivedCents = nextAmount;
    updateCashPayment();
}

async function completeSale(
    paymentMethod,
    receivedCashCents = null
) {
    const items = Array.from(order.values()).map((item) => {
        return {
            product_id: item.id,
            quantity: item.quantity
        };
    });

    const requestBody = {
        payment_method: paymentMethod,
        items: items
    };

    if (paymentMethod === "cash") {
        requestBody.cash_received_cents = receivedCashCents;
    }

    for (const button of paymentButtons) {
        button.disabled = true;
    }

    try {
        const response = await fetch("/api/sales", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
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

        receiptEmployee.textContent =
            result.employee?.name || "Nepoznato";

        receiptTotalElement.textContent =
            euroFormatter.format(result.total_cents / 100);

        const hasCashDetails =
            result.payment_method === "cash" &&
            result.cash_received_cents !== null &&
            result.change_cents !== null;

        receiptCashReceivedRow.hidden = !hasCashDetails;
        receiptChangeRow.hidden = !hasCashDetails;

        if (hasCashDetails) {
            receiptCashReceived.textContent =
                euroFormatter.format(
                    result.cash_received_cents / 100
                );

            receiptChange.textContent =
                euroFormatter.format(
                    result.change_cents / 100
                );
        }

        if (cashPaymentDialog.open) {
            cashPaymentDialog.close();
        }

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

            const employeeName =
                sale.employee?.name || "Nije evidentiran";

            historyItem.innerHTML = `
                <div class="history-item-main">
                    <strong>${sale.receipt_number}</strong>
                    <span>
                        ${dateTimeFormatter.format(new Date(sale.created_at))}
                    </span>
                </div>

                <div class="history-item-payment">
                    <span>${paymentMethod} · ${employeeName}</span>
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
    saleDetailsCashReceivedRow.hidden = true;
    saleDetailsChangeRow.hidden = true;

    saleDetailsNumber.textContent = "Učitavanje...";
    saleDetailsDate.textContent = "—";
    saleDetailsPayment.textContent = "—";
    saleDetailsEmployee.textContent = "—";
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

        saleDetailsEmployee.textContent =
            sale.employee?.name || "Nije evidentiran";

        const hasCashDetails =
            sale.payment_method === "cash" &&
            sale.cash_received_cents !== null &&
            sale.change_cents !== null;

        saleDetailsCashReceivedRow.hidden = !hasCashDetails;
        saleDetailsChangeRow.hidden = !hasCashDetails;

        if (hasCashDetails) {
            saleDetailsCashReceived.textContent =
                euroFormatter.format(
                    sale.cash_received_cents / 100
                );

            saleDetailsChange.textContent =
                euroFormatter.format(
                    sale.change_cents / 100
                );
        }

        saleDetailsStatus.textContent =
            sale.status === "completed"
                ? "Završen"
                : "Storniran";

        saleDetailsStatus.dataset.status = sale.status;

        selectedSaleId = sale.id;
                openStornoButton.hidden =
            sale.status !== "completed" ||
            currentEmployee?.role !== "admin";

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

function updatePinDisplay() {
    pinDisplay.textContent =
        enteredPin.length > 0
            ? "•".repeat(enteredPin.length)
            : "—";

    loginButton.disabled = enteredPin.length < 4;
    loginError.hidden = true;
}


function handlePinKey(key) {
    if (key === "clear") {
        enteredPin = "";
        updatePinDisplay();
        return;
    }

    if (key === "backspace") {
        enteredPin = enteredPin.slice(0, -1);
        updatePinDisplay();
        return;
    }

    if (!/^\d$/.test(key) || enteredPin.length >= 6) {
        return;
    }

    enteredPin += key;
    updatePinDisplay();
}

function clearInactivityTimer() {
    if (inactivityTimer !== null) {
        window.clearTimeout(inactivityTimer);
        inactivityTimer = null;
    }
}


function resetInactivityTimer() {
    clearInactivityTimer();

    if (currentEmployee === null) {
        return;
    }

    inactivityTimer = window.setTimeout(() => {
        logout();
    }, INACTIVITY_TIMEOUT_MS);
}

function setCurrentEmployee(employee) {
    currentEmployee = employee;
    resetInactivityTimer();
    currentEmployeeName.textContent = employee.name;
    currentEmployeeButton.hidden = false;
        openDailyTotalButton.hidden =
        employee.role !== "admin";

    if (loginDialog.open) {
        loginDialog.close();
    }
    checkCurrentShift();
}


function showLogin() {
    currentEmployee = null;
    clearInactivityTimer();
        if (openShiftDialog.open) {
        openShiftDialog.close();
    }
    enteredPin = "";

    currentEmployeeButton.hidden = true;
    openDailyTotalButton.hidden = true;
    updatePinDisplay();

    if (!loginDialog.open) {
        loginDialog.showModal();
    }
}

async function checkAuthentication() {
    try {
        const response = await fetch("/api/auth/me");

        if (!response.ok) {
            showLogin();
            return;
        }

        const employee = await response.json();
        setCurrentEmployee(employee);

    } catch (error) {
        showLogin();
        console.error(error);
    }
}


async function login() {
    if (enteredPin.length < 4) {
        return;
    }

    loginButton.disabled = true;
    loginButton.textContent = "Prijava...";

    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                pin: enteredPin
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.detail || "Prijava nije uspjela."
            );
        }

        setCurrentEmployee(result);

    } catch (error) {
        enteredPin = "";
        updatePinDisplay();

        loginError.textContent = error.message;
        loginError.hidden = false;

        console.error(error);

    } finally {
        loginButton.textContent = "Prijava";
        loginButton.disabled = enteredPin.length < 4;
    }
}

async function logout() {
    try {
        await fetch("/api/auth/logout", {
            method: "POST"
        });

    } catch (error) {
        console.error(error);

    } finally {
        order.clear();
        renderOrder();
        showLogin();
    }
}

function updateOpeningCashDisplay() {
    openingCashDisplay.textContent =
        euroFormatter.format(openingCashCents / 100);

    openShiftError.hidden = true;
}


function handleOpeningCashKey(key) {
    if (key === "clear") {
        openingCashCents = 0;
        updateOpeningCashDisplay();
        return;
    }

    if (key === "backspace") {
        openingCashCents = Math.floor(
            openingCashCents / 10
        );

        updateOpeningCashDisplay();
        return;
    }

    const digit = Number(key);

    if (!Number.isInteger(digit)) {
        return;
    }

    const nextAmount = openingCashCents * 10 + digit;

    if (nextAmount > 9999999) {
        return;
    }

    openingCashCents = nextAmount;
    updateOpeningCashDisplay();
}


function setCurrentShift(shift) {
    currentShift = shift;

    currentShiftButton.textContent = `Smjena #${shift.id}`;
    currentShiftButton.hidden = false;

    if (openShiftDialog.open) {
        openShiftDialog.close();
    }
}

function showOpenShiftDialog() {
    currentShift = null;
    openingCashCents = 0;

    currentShiftButton.textContent = "Smjena zatvorena";
    currentShiftButton.hidden = false;

    updateOpeningCashDisplay();

    const isAdmin = currentEmployee?.role === "admin";

    confirmOpenShiftButton.hidden = !isAdmin;

    if (!isAdmin) {
        openShiftError.textContent =
            "Smjenu mora otvoriti administrator.";
        openShiftError.hidden = false;
    }

    if (!openShiftDialog.open) {
        openShiftDialog.showModal();
    }
}


async function checkCurrentShift() {
    try {
        const response = await fetch("/api/shifts/current");
        const result = await response.json();

        if (response.status === 401) {
            showLogin();
            return null;
        }

        if (!response.ok) {
            throw new Error(
                result.detail ||
                "Smjena se nije mogla učitati."
            );
        }

        if (!result.is_open) {
            showOpenShiftDialog();
            return null;
        }

        setCurrentShift(result.shift);
        return result.shift;

    } catch (error) {
        window.alert(error.message);
        console.error(error);
        return null;
    }
}

function updateClosingCashDisplay() {
    closingCashDisplay.textContent =
        euroFormatter.format(closingCashCents / 100);

    closeShiftError.hidden = true;
}


function handleClosingCashKey(key) {
    if (key === "clear") {
        closingCashCents = 0;
        updateClosingCashDisplay();
        return;
    }

    if (key === "backspace") {
        closingCashCents = Math.floor(
            closingCashCents / 10
        );

        updateClosingCashDisplay();
        return;
    }

    const digit = Number(key);

    if (!Number.isInteger(digit)) {
        return;
    }

    const nextAmount = closingCashCents * 10 + digit;

    if (nextAmount > 9999999) {
        return;
    }

    closingCashCents = nextAmount;
    updateClosingCashDisplay();
}


function showCloseShiftDialog() {
    closingCashCents = 0;
    updateClosingCashDisplay();

    if (shiftDialog.open) {
        shiftDialog.close();
    }

    closeShiftConfirmationDialog.showModal();
}

async function openShiftOverview() {
    const shift = await checkCurrentShift();

    if (shift === null) {
        return;
    }

    shiftDialogTitle.textContent = `Smjena #${shift.id}`;

    shiftOpenedBy.textContent = shift.opened_by.name;

    shiftOpenedAt.textContent =
        dateTimeFormatter.format(
            new Date(shift.opened_at)
        );

    shiftOpeningCash.textContent =
        euroFormatter.format(
            shift.opening_cash_cents / 100
        );

    shiftCashSales.textContent =
        euroFormatter.format(
            shift.cash_total_cents / 100
        );

    shiftCardSales.textContent =
        euroFormatter.format(
            shift.card_total_cents / 100
        );

    shiftReceiptCount.textContent =
        String(shift.receipt_count);

    shiftExpectedCash.textContent =
        euroFormatter.format(
            shift.expected_cash_cents / 100
        );

    startCloseShiftButton.hidden =
        currentEmployee?.role !== "admin";

    shiftDialog.showModal();
}

async function openShift() {
    confirmOpenShiftButton.disabled = true;
    confirmOpenShiftButton.textContent = "Otvaranje...";

    try {
        const response = await fetch("/api/shifts/open", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                opening_cash_cents: openingCashCents
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.detail ||
                "Smjena se nije mogla otvoriti."
            );
        }

        await checkCurrentShift();

    } catch (error) {
        openShiftError.textContent = error.message;
        openShiftError.hidden = false;

        console.error(error);

    } finally {
        confirmOpenShiftButton.disabled = false;
        confirmOpenShiftButton.textContent = "Otvori smjenu";
    }
}

async function closeShift() {
    confirmCloseShiftButton.disabled = true;
    confirmCloseShiftButton.textContent = "Zatvaranje...";

    closeShiftError.hidden = true;

    try {
        const response = await fetch("/api/shifts/close", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                actual_cash_cents: closingCashCents
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.detail ||
                "Smjena se nije mogla zatvoriti."
            );
        }

        let differenceMessage = "Blagajna je točna.";

        if (result.cash_difference_cents > 0) {
            differenceMessage =
                `Višak u blagajni: ${
                    euroFormatter.format(
                        result.cash_difference_cents / 100
                    )
                }`;
        }

        if (result.cash_difference_cents < 0) {
            differenceMessage =
                `Manjak u blagajni: ${
                    euroFormatter.format(
                        Math.abs(
                            result.cash_difference_cents
                        ) / 100
                    )
                }`;
        }

        window.alert(
            `Smjena je uspješno zatvorena.\n\n` +
            `Očekivano: ${
                euroFormatter.format(
                    result.expected_cash_cents / 100
                )
            }\n` +
            `Prebrojeno: ${
                euroFormatter.format(
                    result.actual_cash_cents / 100
                )
            }\n` +
            differenceMessage
        );

        currentShift = null;
        closeShiftConfirmationDialog.close();

        await logout();

    } catch (error) {
        closeShiftError.textContent = error.message;
        closeShiftError.hidden = false;

        console.error(error);

    } finally {
        confirmCloseShiftButton.disabled = false;
        confirmCloseShiftButton.textContent = "Zatvori smjenu";
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
        const paymentMethod = button.dataset.paymentMethod;

        if (paymentMethod === "cash") {
            openCashPayment();
            return;
        }

        completeSale("card");
    });
}

for (const button of cashQuickButtons) {
    button.addEventListener("click", () => {
        if (button.dataset.cashQuick === "exact") {
            cashReceivedCents = cashAmountDueCents;
        } else {
            cashReceivedCents = Number(
                button.dataset.cashQuick
            );
        }

        updateCashPayment();
    });
}

cashKeypad.addEventListener("click", (event) => {
    const button = event.target.closest("[data-cash-key]");

    if (!button) {
        return;
    }

    handleCashKey(button.dataset.cashKey);
});

closeCashPaymentButton.addEventListener("click", () => {
    cashPaymentDialog.close();
});

cancelCashPaymentButton.addEventListener("click", () => {
    cashPaymentDialog.close();
});

confirmCashPaymentButton.addEventListener(
    "click",
    async () => {
        confirmCashPaymentButton.disabled = true;

        await completeSale(
            "cash",
            cashReceivedCents
        );

        if (cashPaymentDialog.open) {
            updateCashPayment();
        }
    }
);

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

loginKeypad.addEventListener("click", (event) => {
    const button = event.target.closest("[data-pin-key]");

    if (!button) {
        return;
    }

    handlePinKey(button.dataset.pinKey);
});

loginButton.addEventListener("click", () => {
    login();
});

currentEmployeeButton.addEventListener("click", () => {
    const shouldLogout = window.confirm(
        `Odjaviti zaposlenika ${currentEmployee.name}?`
    );

    if (shouldLogout) {
        logout();
    }
});

loginDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
});

loginDialog.addEventListener("close", () => {
    if (currentEmployee === null) {
        window.setTimeout(() => {
            showLogin();
        }, 0);
    }
});

window.addEventListener(
    "pointerdown",
    resetInactivityTimer
);

window.addEventListener(
    "keydown",
    resetInactivityTimer
);

for (const button of openingCashQuickButtons) {
    button.addEventListener("click", () => {
        openingCashCents = Number(
            button.dataset.openingCashQuick
        );

        updateOpeningCashDisplay();
    });
}

openingCashKeypad.addEventListener("click", (event) => {
    const button = event.target.closest(
        "[data-opening-cash-key]"
    );

    if (!button) {
        return;
    }

    handleOpeningCashKey(
        button.dataset.openingCashKey
    );
});

confirmOpenShiftButton.addEventListener("click", () => {
    openShift();
});

openShiftDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
});

openShiftDialog.addEventListener("close", () => {
    if (
        currentEmployee !== null &&
        currentShift === null
    ) {
        window.setTimeout(() => {
            showOpenShiftDialog();
        }, 0);
    }
});

currentShiftButton.addEventListener("click", () => {
    if (currentShift !== null) {
        openShiftOverview();
    }
});

closeShiftDialogButton.addEventListener("click", () => {
    shiftDialog.close();
});

startCloseShiftButton.addEventListener("click", () => {
    showCloseShiftDialog();
});

closingCashKeypad.addEventListener("click", (event) => {
    const button = event.target.closest(
        "[data-closing-cash-key]"
    );

    if (!button) {
        return;
    }

    handleClosingCashKey(
        button.dataset.closingCashKey
    );
});

cancelCloseShiftButton.addEventListener("click", () => {
    closeShiftConfirmationDialog.close();
    openShiftOverview();
});

closeShiftConfirmationDialog.addEventListener(
    "cancel",
    (event) => {
        event.preventDefault();
        closeShiftConfirmationDialog.close();
        openShiftOverview();
    }
);

confirmCloseShiftButton.addEventListener("click", () => {
    closeShift();
});

loadProducts();
checkAuthentication();