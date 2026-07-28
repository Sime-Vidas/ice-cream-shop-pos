# Database Design

The first version uses SQLite and contains three main tables:

- `products`
- `sales`
- `sale_items`

## Relationship

One sale can contain multiple sale items.

One product can appear in multiple sale items.

```text
products 1 ─── N sale_items N ─── 1 sales
```

## Products

The `products` table stores the products available for sale.

| Column | Purpose |
|---|---|
| `id` | Unique product identifier |
| `name` | Product name |
| `price_cents` | Price stored in cents |
| `active` | Determines whether the product can currently be sold |

For example, a Sladoled priced at €2.50 is stored as `250` cents.

## Sales

The `sales` table stores completed receipts.

| Column | Purpose |
|---|---|
| `id` | Unique sale identifier |
| `receipt_number` | Unique demo receipt number |
| `created_at` | Date and time of the sale |
| `payment_method` | Cash or card |
| `total_cents` | Complete sale total in cents |
| `status` | Current receipt status |

## Sale items

The `sale_items` table stores the individual products belonging to a sale.

| Column | Purpose |
|---|---|
| `id` | Unique sale-item identifier |
| `sale_id` | Sale containing this item |
| `product_id` | Original product |
| `product_name` | Product name at the time of sale |
| `unit_price_cents` | Unit price at the time of sale |
| `quantity` | Number of units sold |
| `line_total_cents` | Unit price multiplied by quantity |

The product name and price are copied into each sale item so that an old receipt remains correct even if the product is renamed or its price changes later.

## Example

A customer buys four ice creams:

```text
Product: Sladoled
Unit price: 250 cents
Quantity: 4
Line total: 1000 cents (€10.00)
```

## Future additions

Later versions can add:

- employees and PIN authentication
- work shifts and opening cash
- receipt cancellation and cancellation reasons
- audit logs
- application settings
- fiscalization information