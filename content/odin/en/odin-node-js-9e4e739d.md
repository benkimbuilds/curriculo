# Project: Inventory Application

## The product

Build inventory for an imaginary store: instruments, groceries, games or another domain. Visitors choose a category and see its items. Both categories and items must support create, read, update and delete; a static catalogue is insufficient.

## Assignment

1. Create a Next App Router project and practice PostgreSQL database.
2. Design tables, fields, relationships and constraints first. A game may have multiple genres and developers; a category may contain many items. Use a join table for many-to-many relationships.
3. Map list, detail and form routes. Server Components read; validated Server Actions or Route Handlers write.
4. Build category and item read views first.
5. Implement create and update forms, including useful fields such as description, price and stock. Store money as integer minor units or suitable decimals rather than relying on floating-point rounding.
6. Define deletion of occupied categories: reject it, reassign items or remove them together. Explain the behavior in the UI and enforce it through foreign keys and transactions.
7. Write a fictional-data seed script. Run locally and deliberately after deployment without overwriting real records.
8. Deploy and document how to exercise every operation.

## Relationship example

```sql
CREATE TABLE categories (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);
CREATE TABLE items (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  stock INTEGER NOT NULL CHECK (stock >= 0)
);
```

This model rejects deletion of occupied categories. If items have multiple genres, use a join table rather than comma-separated identifiers.

## Acceptance criteria

- Complete category and item CRUD through the UI.
- Updating an item refreshes its list and detail.
- Negative values, blank fields and missing IDs produce useful failures without writes.
- Direct endpoint calls cannot bypass deletion rules.
- All user-supplied query values are parameterized.
- Starting from an empty database and seeding are reproducible.
- Data survives service restarts.

## Extensions

Polish presentation after CRUD works. Protect updates and deletion with authentication and a server-checked administrator role. The original suggests an intermediate shared administrator password; this adaptation replaces that with session authorization. Never place secrets in browser code or trust hidden buttons. Open CRUD is acceptable only in an isolated fictional-data demonstration before accounts are added.

