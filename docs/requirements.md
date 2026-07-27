# Ice Cream Shop POS — Requirements

## Project purpose

Ice Cream Shop POS is a demonstrational point-of-sale system for a small ice cream shop.

The project is intended for learning and portfolio purposes. Version 0.1 does not perform real card payments, fiscalisation or legally valid receipt generation.

## Shop business rules

- The shop sells ice cream for 2.50 € per unit.
- One button press adds one ice cream to the current receipt.
- Scoop ice cream and soft ice cream are recorded under the same product: "Sladoled".
- Example: four scoops are recorded as "Sladoled × 4".
- The system supports cash and card as payment methods.
- Card payment is simulated and does not communicate with a real POS terminal.
- All prices are displayed in euros.

## Version 0.1 features

### Current sale

The cashier can:

- Add an ice cream to the receipt
- Increase or decrease the quantity
- Remove the product from the receipt
- View the current quantity
- View the total price
- Cancel the current sale
- Select cash or card payment
- Confirm the sale

### Receipt

After confirming a sale, the system creates a demonstrational receipt containing:

- Receipt number
- Date and time
- Product name
- Quantity
- Price per unit
- Total amount
- Payment method
- Clear notice that the receipt is not fiscalised

### Transaction storage

Every completed sale is saved in the database with:

- Unique ID
- Receipt number
- Date and time
- Total amount
- Payment method
- Sold quantity

### Daily report

The system displays:

- Total number of receipts
- Total number of ice creams sold
- Total revenue
- Cash revenue
- Card revenue

## Version 0.1 limitations

The first version will not include:

- Real fiscalisation
- FINA certificates
- Real POS terminal integration
- Real card processing
- Legally valid receipt printing
- Inventory management
- Employee accounts
- Shift management
- Discounts
- Mixed cash and card payments
- Online access
- Customer accounts

## Technology

- Backend: Python and FastAPI
- Frontend: HTML, CSS and JavaScript
- Database: SQLite
- API format: REST and JSON
- Development environment: VS Code
- Version control: Git and GitHub

## Planned future features

Possible later versions may include:

- Transaction history
- Receipt cancellation and storno
- Product and price settings
- Employee accounts
- Shift opening and closing
- Inventory tracking
- Receipt printer integration
- Automatic backups
- PostgreSQL database
- Fiscalisation
- FINA certificate integration
- POS terminal integration

## Safety notice

This repository contains only a demonstrational POS system using test data.

It must not be used for real sales, real card payments or fiscalised receipt generation.