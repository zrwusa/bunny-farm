## Contributing


**Conventional Commits**
<table>
  <tr>
    <th>Identifier</th>
    <th>Purpose</th>
  </tr>
  <tr>
    <td>feat</td>
    <td>Introduce a new feature</td>
  </tr>
  <tr>
    <td>fix</td>
    <td>Fix an error or defect</td>
  </tr>
  <tr>
    <td>chore</td>
    <td>General maintenance tasks (e.g., build, configuration, dependencies)</td>
  </tr>
  <tr>
    <td>docs</td>
    <td>Documentation changes (additions, updates, fixes)</td>
  </tr>
  <tr>
    <td>style</td>
    <td>Changes in code style, formatting, whitespace, etc. (no impact on functionality)</td>
  </tr>
  <tr>
    <td>refactor</td>
    <td>Code refactoring (typically, no functional changes)</td>
  </tr>
  <tr>
    <td>perf</td>
    <td>Performance optimizations</td>
  </tr>
  <tr>
    <td>test</td>
    <td>Changes related to tests (additions, updates, fixes)</td>
  </tr>
  <tr>
    <td>build</td>
    <td>Changes to the build system or external dependencies</td>
  </tr>
  <tr>
    <td>ci</td>
    <td>Changes related to continuous integration and deployment (CI/CD)</td>
  </tr>
  <tr>
    <td>revert</td>
    <td>Revert a previous commit</td>
  </tr>
  <tr>
    <td>merge</td>
    <td>Merge branches or pull requests</td>
  </tr>
  <tr>
    <td>release</td>
    <td>Commits related to version releases</td>
  </tr>
</table>

## Development Commands

### Create resource of a module including module, controller/resolver, service
```shell
nest g resource [module name]
```

### "duplicate key value violates unique constraint" problem resolve
```
SELECT conname, conrelid::regclass, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conname = 'XX_xxxxxxxxxxxxxxxxxxxxxxxxxxx';
```



## Contributing Guidelines

Thank you for considering contributing to this project! To ensure a smooth development process, please follow these guidelines.

### Important Notes on TypeORM Relations

When working with TypeORM relations, it's important to be aware of the performance implications of different loading strategies:

1. **Eager Loading (`eager: true`)**:
    - **Behavior**: Automatically loads the related entities using a `LEFT JOIN` whenever the main entity is queried.
    - **Performance Impact**: This can result in complex and heavy queries, potentially fetching unnecessary data even if it's not requested by the client (e.g., in GraphQL queries).
    - **Recommendation**: Use eager loading sparingly, only when you're certain the related data will always be needed.

2. **Lazy Loading (`lazy: true`)**:
    - **Behavior**: Defers loading of related entities until the property is explicitly accessed in the code.
    - **Performance Impact**: This can lead to multiple separate queries being executed, potentially causing the **N+1 query problem**.
    - **Recommendation**: When using lazy loading, consider batching queries or using `leftJoinAndSelect` in custom queries to optimize performance.

### Best Practices for Managing Relations

- **Avoid N+1 Query Problems**:
    - Use `leftJoinAndSelect` in your queries when you know related data is needed.
    - Consider using batching tools like `DataLoader` in GraphQL to optimize related entity loading.

- **GraphQL Query Optimization**:
    - Use `@Info()` in resolvers to dynamically load related data only when requested by the client.
    - Example:
      ```typescript
      @Query(() => [Product])
      async products(@Info() info: GraphQLResolveInfo) {
        const fields = graphqlFields(info);
        const query = this.productRepo.createQueryBuilder('product');
  
        if (fields.category) {
          query.leftJoinAndSelect('product.category', 'category');
        }
  
        return query.getMany();
      }
      ```

By following these guidelines, we can ensure efficient database interactions and maintain high performance in our application.

---

For any questions or further clarification, feel free to open an issue or reach out to the maintainers. Happy coding!


# Elasticsearch

```shell
 curl -X GET "https://localhost:9200/products/_search?pretty" -u elastic:dev_password --cacert certs/ca.crt --insecure
```