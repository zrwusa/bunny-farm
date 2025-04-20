describe('Cart Flow Test', () => {
  beforeEach(() => {
    // Visit the product list page
    cy.visit('http://localhost:3000/shopping/products');

    // Check if already logged in, if not then login
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="login-button"]').length) {
        cy.get('[data-testid="login-button"]').click();

        // Login with Google account
        cy.origin('https://accounts.google.com', () => {
          cy.get('input[type="email"]').type(Cypress.env('GOOGLE_TEST_EMAIL'));
          cy.get('button').contains('Next').click();
          cy.get('input[type="password"]').type(Cypress.env('GOOGLE_TEST_PASSWORD'));
          cy.get('button').contains('Next').click();
        });

        // Wait for login to complete
        cy.wait(5000);
      }
    });
  });

  it('should complete the full cart flow', () => {
    // Wait for product list to load
    cy.get('[data-testid="product-card"]', { timeout: 10000 }).should('exist');

    // Click on the first product to enter details page
    cy.get('[data-testid="product-card"]').first().click();
    cy.wait(2000);
    cy.url().should('include', '/shopping/products/', { timeout: 10000 });

    // Wait for variants to load
    cy.get('[data-testid="add-to-cart"]', { timeout: 10000 }).should('exist');

    // Add two different variants to cart
    cy.get('[data-testid="add-to-cart"]').first().click();
    cy.wait(2000);
    cy.get('[data-testid="add-to-cart"]').last().click();
    cy.wait(2000);

    // Click cart icon to enter cart page
    cy.get('[data-testid="cart-icon"]').click();
    cy.wait(2000);
    cy.url().should('include', '/shopping/cart', { timeout: 10000 });

    // Remove one variant
    cy.get('[data-testid="remove-item"]').first().click();
    cy.wait(5000);

    // Visit cart page to check variant count
    cy.visit('http://localhost:3000/shopping/cart');
    cy.wait(5000);
    cy.get('[data-testid="cart-item"]', { timeout: 10000 }).should('have.length', 1);

    // Return to product list page
    cy.visit('http://localhost:3000/shopping/products');
    cy.wait(2000);

    // Click on the second product to enter details page
    cy.get('[data-testid="product-card"]').eq(1).click();
    cy.wait(2000);
    cy.url().should('include', '/shopping/products/', { timeout: 10000 });

    // Add product to cart
    cy.get('[data-testid="add-to-cart"]').first().click();
    cy.wait(2000);

    // Visit cart page to check product information
    cy.visit('http://localhost:3000/shopping/cart');
    cy.wait(5000);
    cy.get('[data-testid="cart-item"]', { timeout: 10000 }).should('have.length', 2);

    // Click Clear Cart
    cy.get('[data-testid="clear-cart"]').click();
    cy.wait(5000);

    // Check if cart is empty
    cy.get('[data-testid="cart-item"]').should('not.exist');
    cy.get('[data-testid="empty-cart-message"]').should('be.visible');
  });
});