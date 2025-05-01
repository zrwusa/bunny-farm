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

[//]: # (    <tr>)

[//]: # (      <td>Track User Checkout Behavior</td>)

[//]: # (      <td>❌ No logging or snapshot mechanism</td>)

[//]: # (      <td>✅ Record item snapshot at checkout for traceability</td>)

[//]: # (    </tr>)
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