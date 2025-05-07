describe('Cart Flow Test', () => {
  beforeEach(() => {
    // Visit the product list page
    cy.visit('http://localhost:3000/shopping/products');

    // Check if already logged in, if yes then logout
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="avatar-button"]').length) {
        cy.get('[data-testid="avatar-button"]').click();
        cy.get('[data-testid="logout-button"]').click();
        cy.wait(1000);
      }
    });
  });

  it('should complete the full cart flow', () => {
    // Click on the first product to enter details page
    cy.get('[data-testid="product-card"]').first().click();
    cy.wait(1000);

    // Verify we're on a product detail page
    cy.url().should('match', /\/shopping\/products\/[^/]+$/);

    // Add two different skus to cart
    cy.get('[data-testid="add-to-cart"]').first().click();
    cy.wait(1000);
    cy.get('[data-testid="add-to-cart"]').last().click();
    cy.wait(1000);

    // Click cart icon to enter cart page
    cy.get('[data-testid="cart-icon"]').click();
    cy.wait(1000);
    cy.url().should('include', '/shopping/cart');

    // Remove one sku
    cy.get('[data-testid="remove-item"]').first().click();
    cy.wait(1000);

    // Click login button
    cy.get('[data-testid="login-button"]').click();
    cy.wait(1000);

    // Wait for login page to load
    cy.url().should('include', '/login');
    cy.wait(1000);

    // Fill in login form
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('Password_123');
    cy.get('button[type="submit"]').click();

    // Wait for login to complete and redirect
    cy.wait(2000); // Wait for login process
    cy.url().should('not.include', '/login'); // Verify we're not on login page anymore

    // Wait for the page to fully load and check for avatar button
    cy.wait(2000);
    cy.get('[data-testid="avatar-button"]', { timeout: 1000 }).should('exist');

    // Click avatar to show logout button
    cy.get('[data-testid="avatar-button"]').click();
    cy.get('[data-testid="logout-button"]').should('exist');

    // Visit cart page to check sku count
    cy.visit('http://localhost:3000/shopping/cart');
    cy.wait(1000);
    cy.get('[data-testid="cart-item"]').should('have.length', 1);

    // Return to product list page
    cy.visit('http://localhost:3000/shopping/products');
    cy.wait(1000);

    // Click on the second product to enter details page
    cy.get('[data-testid="product-card"]').eq(1).click();
    cy.wait(1000);
    cy.url().should('include', '/shopping/products/');

    // Add product to cart
    cy.get('[data-testid="add-to-cart"]').first().click();
    cy.wait(1000);

    // Visit cart page to check product information
    cy.visit('http://localhost:3000/shopping/cart');
    cy.wait(1000);
    cy.get('[data-testid="cart-item"]').should('have.length', 2);

    // Click Clear Cart
    cy.get('[data-testid="clear-cart"]').click();
    cy.wait(1000);

    // Check if cart is empty
    cy.get('[data-testid="cart-item"]').should('not.exist');
    cy.get('[data-testid="empty-cart-message"]').should('be.visible');
  });
});