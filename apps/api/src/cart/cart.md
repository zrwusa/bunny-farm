<table>
  <thead>
    <tr>
      <th>Operation</th>
      <th>Storage Medium</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Add/Modify/Delete Item</td>
      <td>Redis</td>
      <td>All operations are first applied to Redis for fast, low-latency response.</td>
    </tr>
    <tr>
      <td>Query Cart</td>
      <td>Redis</td>
      <td>The cart is retrieved directly from Redis for the current user.</td>
    </tr>
    <tr>
      <td>Checkout (Place Order)</td>
      <td>Redis + Database</td>
      <td>The cart is read from Redis, order is written to the database, and the cart is either persisted or cleared.</td>
    </tr>
    <tr>
      <td>Exception Handling / Disaster Recovery</td>
      <td>Database</td>
      <td>If Redis data is lost, the cart can be rebuilt from the database.</td>
    </tr>
  </tbody>
</table>

<table>
  <thead>
    <tr>
      <th>Requirement</th>
      <th>Status</th>
      <th>Risk / Recommendation</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Partial Checkout</td>
      <td>❌ Redis structure does not support fine-grained updates</td>
      <td>✅ Add item-level update logic</td>
    </tr>
    <tr>
      <td>Concurrent Modification</td>
      <td>❌ Entire cart is overwritten during set operations</td>
      <td>✅ Use per-item storage or fine-grained merge</td>
    </tr>
    <tr>
      <td>Clear Checked-out Items</td>
      <td>❌ Not implemented</td>
      <td>✅ Remove corresponding items after successful checkout</td>
    </tr>
  </tbody>
</table>

Synchronization mechanism
Timed batch synchronization:

Use timed tasks such as hourly, daily) to sync shopping cart data in Redis to a database for persistence or big data analytics.

User behavior triggers synchronization:

When the user performs the following behavior, the system will synchronize Redis to the database:

Login / Logout (merge shopping cart)

Submit order (settlement)

Shopping cart is not active for a long time (write back to DB)

Asynchronous write:

Use message queues (such as Kafka, RocketMQ) to record shopping cart changes, consume asynchronously in the background and synchronize to the database to avoid blocking the main process.

The role of the database
Used to persist cart data (prevent Redis data loss).

Used for big data analysis (such as user behavior, product preference).

Used for cold start user recovery (such as the user merges historical shopping carts when logging in across devices)

| Function Classification | Function Points | Visitor Support | Login User Support | Description / Note |
|--------------|----------------------------------|-----------|----------------|--------------|
| 🧍 User Identification | Use `guestCartId` to identify visitors | ✅ | ❌ | Saved in localStorage |
| | Use `userId` to identify logged-in users | ❌ | ✅ | |
| 🛒 Basic Operations | Add Product to Cart | ✅ | ✅ | SKU Dimension Add |
| | Modified Quantity | ✅ | ✅ | Quantity +/− |
| | Check to delete product | ✅ | ✅ | Press SKU to delete |
| | Clear the shopping cart | ✅ | ✅ | Clear with one click |
| ✅ Status Management | Check/Uncheck a product | ✅ | ✅ | Used for settlement page |
| | Select all/not select all | ✅ | ✅ | By merchant/global |
| | Purchase restrictions, no-stock sign | ✅ | ✅ | Usually placed in `extraData` |
| 🔁 Merge logic | Merge the tourist cart to the user cart after logging in | ✅ | ✅ | Automatically trigger the merge |
| | SKU Conflict Merge Strategy | ✅ | ✅ | Add/cover the number of SKUs |
| 🧠 Product snapshot | Keep product information snapshot (name/picture/price) | ✅ | ✅ | The original information will still be displayed after the product is removed |
| | Reminder for product price changes | ✅ | ✅ | Used to mark "price increase/price reduction" |
| ⏰ Life Cycle | Save the Visitor Cart for 30 Days | ✅ | — | Redis |
| | Login user's shopping cart is permanently saved | — | ✅ | Redis, sync to the database in 1 hour regularly |
| 🧱 Data storage | Visitor shopping cart exists in Redis | ✅ | — | Redis Key: `cart:guest:{guestCartId}` |
| | Log in to user shopping cart Redis | — | ✅ | Redis Key: `cart:user:{userId}` |
| 📱 Multi-terminal support | Web/App shopping cart synchronization | ❌/partial support | ✅ | Need to log in and synchronize |
| 🛡 Safety and verification | Whether the SKU is valid and whether it is available for purchase | ✅ | ✅ | Check before addition and settlement |
| | Product inventory verification | ✅ | ✅ | Price, inventory, purchase restrictions inspection |
| 📊 Analysis log | Record shopping cart modification log (optional) | Optional | Optional | For operation and conversion analysis |

## Data synchronization policy (from Redis → PostgreSQL)

| Synchronization timing | Description                             |
|------------------|-------------------------------------|
| When the user logs in | Merge `cart:guest:{guestCartId}` into `cart:user:{userId}` and write to the database |
| Before submission of user settlement | Persist once in advance to prevent order failure and cannot restore the shopping cart |
| Backend timed tasks | Synchronize active users shopping carts to the database every hour |
| Manual trigger (operation and maintenance) | Force synchronization of a user Redis → DB |

Note points (trap)
✅ Redis and database structure consistency. You need to have mapping tools, such as converters (DTO → DB Model);

⚠ Avoid dirty data overwriting, such as the B-side login caused Redis to be overwritten when the A-side is not synchronized;

⚠ Redis data TTL must have fallback (such as reading the database);

✅ Log in to merge with conflict handling policies (overwrite? Merge? Skip?);

✅ Multiple choice deletion can implement "batch SKU removal" on the Redis side, which is very suitable for Hash