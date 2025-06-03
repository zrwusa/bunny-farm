## Async Server Component cannot be rendered in Client Component

| Component Type | Whether to use in Client Component | Description |
| --------------------------------------- | -------------------------- | --------------------------------------------------------- |
| ✅ **Other Client Components** | ✅ **Available** | Normal use |
| ✅ **Synchronous Server Component** (not async) | ✅ **Yes** | If there is no `async` and `await`, it is actually ordinary function components. Next.js will directly turn it into a pure JSX fragment |
| ❌ **Async Server Component** (including `async` function) | ❌ **No** | An error or hydration failure will be reported, React does not allow the `await` component to be executed on the client side |


| Project | Support |
| ------------------------------------------- | ------------------ |
| Use async Server Component in Client Component | ❌ No |
| Use Synchronous Server Component in Client Component | ✅ Yes (such as pure JSX output components) |
| Nested async Server Component in Server Component | ✅ Support |
| Server Component Obtain data and pass it to Client Component | ✅ Recommended method |
