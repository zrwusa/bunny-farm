<table>
  <tr>
    <th>Scenario</th>
    <th>Use PostgreSQL</th>
    <th>Use MongoDB</th>
    <th>Use Elasticsearch</th>
    <th>Use Redis</th>
  </tr>
  <tr>
    <td>Orders & Payments</td>
    <td>✅</td>
    <td>❌</td>
    <td>❌</td>
    <td>❌</td>
  </tr>
  <tr>
    <td>Inventory Management</td>
    <td>✅</td>
    <td>❌</td>
    <td>❌</td>
    <td>❌</td>
  </tr>
  <tr>
    <td>User Data</td>
    <td>✅</td>
    <td>❌</td>
    <td>❌</td>
    <td>✅ (Session)</td>
  </tr>
  <tr>
    <td>Product Details</td>
    <td>❌</td>
    <td>✅</td>
    <td>❌</td>
    <td>✅ (Cache Hot Items)</td>
  </tr>
  <tr>
    <td>Search & Recommendation</td>
    <td>❌</td>
    <td>❌</td>
    <td>✅</td>
    <td>❌</td>
  </tr>
  <tr>
    <td>Logs & Tracking</td>
    <td>❌</td>
    <td>✅</td>
    <td>✅</td>
    <td>❌</td>
  </tr>
  <tr>
    <td>Shopping Cart & Token</td>
    <td>❌</td>
    <td>❌</td>
    <td>❌</td>
    <td>✅</td>
  </tr>
</table>

## Product data acquisition hybrid solution:

Search the list page (only basic information is required): Use Elasticsearch data directly.
Product Details Page (Newest Data required): Elasticsearch Returns the ID and checks the database.
This ensures the consistency of key data while ensuring search performance

## Elasticsearch only synchronizes data that has changed in PostgreSQL (i.e. incremental updates)
Based on PostgreSQL CDC (Change Data Capture) + Kafka (more real-time)
Synchronize PostgreSQL changes in real time, we use PostgreSQL Logical Replication + Kafka:

PostgreSQL listens to INSERT/UPDATE/DELETE of the products table.
Use Debezium to read the change stream and push it to Kafka.
NestJS consumes Kafka messages and syncs to Elasticsearch.
This method is more real-time and more accurate, but has higher deployment complexity and is suitable for large-scale data synchronization.
