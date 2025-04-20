// Add type declaration at the top of the file
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: () => void;
          renderButton: () => void;
          prompt: () => void;
          disableAutoSelect: () => void;
          storeCredential: () => void;
          cancel: () => void;
          revoke: () => void;
          getToken: () => { credential: string };
        };
      };
    };
  }
}

describe('Cart Flow Test', () => {
  beforeEach(() => {
    // Visit the product list page
    cy.visit('http://localhost:3000/shopping/products');

    // Check if already logged in, if yes then logout
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="logout-button"]').length) {
        cy.get('[data-testid="logout-button"]').click();
        cy.wait(2000);
      }
    });
  });

  it('should complete the full cart flow', () => {
    // Click on the first product to enter details page
    cy.get('[data-testid="product-card"]').first().click();
    cy.wait(2000);
    cy.url().should('include', '/shopping/products/360372033897218397');

    // Add two different variants to cart
    cy.get('[data-testid="add-to-cart"]').first().click();
    cy.wait(2000);
    cy.get('[data-testid="add-to-cart"]').last().click();
    cy.wait(2000);

    // Click cart icon to enter cart page
    cy.get('[data-testid="cart-icon"]').click();
    cy.wait(2000);
    cy.url().should('include', '/shopping/cart');

    // Remove one variant
    cy.get('[data-testid="remove-item"]').first().click();
    cy.wait(5000);

    // Click login button
    cy.get('[data-testid="login-button"]').click();
    cy.wait(2000);

    // Wait for login page to load
    cy.url().should('include', '/login');
    cy.wait(2000);

    // Wait for Google login button to be visible
    cy.get('.S9gUrf-YoZ4jf').should('be.visible');
    cy.wait(2000);

    // Mock the Google login success
    cy.window().then((win) => {
      const mockGoogleResponse = {
        credential: 'mock-google-token'
      };
      // @ts-ignore
      win.google = {
        accounts: {
          id: {
            initialize: () => {},
            renderButton: () => {},
            prompt: () => {},
            disableAutoSelect: () => {},
            storeCredential: () => {},
            cancel: () => {},
            revoke: () => {},
            getToken: () => mockGoogleResponse
          }
        }
      };
    });

    // Mock the Google login response
    cy.intercept('POST', 'http://localhost:8080/graphql', (req) => {
      if (req.body.operationName === 'GoogleLogin') {
        req.reply({
          data: {
            login: {
              accessToken: 'mock-access-token',
              refreshToken: 'mock-refresh-token'
            }
          }
        });
      }
    }).as('googleLogin');

    // Click the Google login button
    cy.get('.S9gUrf-YoZ4jf').click();
    cy.wait(2000);

    // Wait for login to complete
    cy.wait('@googleLogin');
    cy.wait(2000);

    // Verify we are logged in by checking for logout button
    cy.get('[data-testid="logout-button"]').should('exist');

    // Visit cart page to check variant count
    cy.visit('http://localhost:3000/shopping/cart');
    cy.wait(5000);
    cy.get('[data-testid="cart-item"]').should('have.length', 1);

    // Return to product list page
    cy.visit('http://localhost:3000/shopping/products');
    cy.wait(2000);

    // Click on the second product to enter details page
    cy.get('[data-testid="product-card"]').eq(1).click();
    cy.wait(2000);
    cy.url().should('include', '/shopping/products/');

    // Add product to cart
    cy.get('[data-testid="add-to-cart"]').first().click();
    cy.wait(2000);

    // Visit cart page to check product information
    cy.visit('http://localhost:3000/shopping/cart');
    cy.wait(5000);
    cy.get('[data-testid="cart-item"]').should('have.length', 2);

    // Click Clear Cart
    cy.get('[data-testid="clear-cart"]').click();
    cy.wait(5000);

    // Check if cart is empty
    cy.get('[data-testid="cart-item"]').should('not.exist');
    cy.get('[data-testid="empty-cart-message"]').should('be.visible');
  });
});