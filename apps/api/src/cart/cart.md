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
| 功能分类     | 功能点                           | 游客支持 | 登录用户支持 | 说明 / 备注 |
|--------------|----------------------------------|-----------|----------------|--------------|
| 🧍 用户识别   | 使用 `clientCartId` 识别游客       | ✅        | ❌             | 存于 localStorage |
|              | 使用 `userId` 识别登录用户         | ❌        | ✅             |           |
| 🛒 基本操作   | 添加商品到购物车                  | ✅        | ✅             | SKU 维度添加                 |
|              | 修改数量                           | ✅        | ✅             | 数量 +/−                      |
|              | 勾选删除商品                           | ✅        | ✅             | 按 SKU 删除                   |
|              | 清空购物车                         | ✅        | ✅             | 一键清空                      |
| ✅ 状态管理   | 勾选/取消勾选某商品                | ✅        | ✅             | 用于结算页                    |
|              | 全选/全不选                        | ✅        | ✅             | 按商家/全局                   |
|              | 限购提醒、无货标识                 | ✅        | ✅             | 通常放在 `extraData`         |
| 🔁 合并逻辑   | 登录后将游客购物车合并到用户购物车 | ✅        | ✅             | 自动触发合并                 |
|              | SKU 冲突合并策略                   | ✅        | ✅             | 如同一 SKU 数量相加/覆盖     |
| 🧠 商品快照   | 保留商品信息快照（名称/图片/价）  | ✅        | ✅             | 商品下架后依然展示原信息     |
|              | 商品价格变动提醒                   | ✅        | ✅             | 用于标记“涨价/降价”          |
| ⏰ 生命周期   | 游客购物车保存 30 天             | ✅        | —              | Redis             |
|              | 登录用户购物车永久保存             | —         | ✅             | Redis，定时1小时同步到数据库                     |
| 🧱 数据存储   | 游客购物车存在 Redis 中            | ✅        | —              | Redis Key: `cart:guest:{clientCartId}` |
|              | 登录用户购物车 Redis 中          | —         | ✅             | Redis Key: `cart:user:{userId}` |
| 📱 多端支持   | Web / App购物车同步       | ❌/部分支持 | ✅             | 需登录同步                    |
| 🛡 安全与校验 | SKU 是否有效、是否可购买校验       | ✅        | ✅             | 添加和结算前都需检查         |
|              | 商品库存校验                       | ✅        | ✅             | 价格、库存、限购检查         |
| 📊 分析日志   | 记录购物车修改日志（可选）         | 可选      | 可选           | 用于运营、转化分析           |
## 数据同步策略（从 Redis → PostgreSQL）

| 同步时机        | 说明                                |
|------------------|-------------------------------------|
| 用户登录时       | 将 `cart:guest:{clientCartId}` 合并进 `cart:user:{userId}`，并写入数据库 |
| 用户结算提交前   | 提前持久化一次，以防订单失败无法还原购物车 |
| 后台定时任务     | 每小时同步活跃用户购物车到数据库   |
| 手动触发（运维） | 对某个用户强制同步 Redis → DB      |

注意点（陷阱）
✅ Redis 与数据库结构一致性 要有映射工具，如转换器（DTO → DB Model）；

⚠ 避免脏数据覆盖，如 A 端未同步时 B 端登录导致 Redis 被覆盖；

⚠ Redis 数据 TTL 过期时要有 fallback（如读数据库）；

✅ 登录合并要有冲突处理策略（覆盖？合并？跳过？）；

✅ 多选删除可以 Redis 侧实现“批量 SKU 移除”，非常适合 Hash