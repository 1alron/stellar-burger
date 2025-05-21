describe('Тестирование конструктора бургеров', () => {
  const baseUrl = Cypress.config('baseUrl');
  const bunConstructorSelector = '[data-cy="bun-constructor"]';
  const ingredientsSelector = '[data-cy="ingredients"]';
  const bun = '[data-cy="bun"]';
  const ingredientsConstructorSelector = '[data-cy="ingredients-constructor"]';

  beforeEach(() => {
    cy.fixture('ingredients.json').then((data) => {
      cy.intercept('GET', 'api/ingredients', {
        statusCode: 200,
        body: data,
      });
    });
    cy.fixture('user.json').then((data) => {
      cy.intercept('GET', 'api/auth/user', {
        statusCode: 200,
        body: data,
      }).as('fetchUser');
    });
    cy.fixture('order.json').then((data) => {
      cy.intercept('POST', 'api/orders', {
        statusCode: 200,
        body: data,
      }).as('createOrder');
    });
    cy.setCookie('accessToken', 'exampleAccessToken');
    cy.setCookie('refreshToken', 'exampleRefreshToken');
    cy.visit(baseUrl);

    cy.get(bunConstructorSelector).as('bunConstructor');
    cy.get(ingredientsSelector).as('ingredientsContainer');
    cy.get(ingredientsConstructorSelector).as('ingredientsConstructor');
  });

  it('Открытие и закрытие модального окна', () => {
    cy.openIngredientDetails('Краторная булка N-200i');
    cy.get('@modal').should('contain', 'Краторная булка N-200i');
    cy.closeModalByButton();

    cy.openIngredientDetails('Филе Люминесцентного тетраодонтимформа');
    cy.get('@modal').should('contain', 'Филе Люминесцентного тетраодонтимформа');
    cy.closeModalByOverlay();
  });

  it('Добавление булки в конструктор', () => {
    cy.get('@bunConstructor').should('not.contain', 'Краторная булка N-200i');
    cy.addItemToConstructor('Краторная булка N-200i');
    cy.get(bun).should('contain', 'Краторная булка N-200i');
  });

  it('Добавление начинки и соуса в конструктор', () => {
    cy.get('@bunConstructor').should('not.contain', 'Краторная булка N-200i');
    cy.addItemToConstructor('Краторная булка N-200i');
    cy.get(bun).should('contain', 'Краторная булка N-200i');

    cy.get('@ingredientsContainer').should('not.contain', 'Филе Люминесцентного тетраодонтимформа');
    cy.addItemToConstructor('Филе Люминесцентного тетраодонтимформа');
    cy.get('@ingredientsContainer').should('contain', 'Филе Люминесцентного тетраодонтимформа');

    cy.get('@ingredientsContainer').should('not.contain', 'Соус традиционный галактический');
    cy.addItemToConstructor('Соус традиционный галактический');
    cy.get('@ingredientsContainer').should('contain', 'Соус традиционный галактический');
  });

  describe('Оформление заказа', () => {
    it('Создание заказа и очистка конструктора', () => {
      cy.get('@bunConstructor').should('not.contain', 'Краторная булка N-200i');
      cy.addItemToConstructor('Краторная булка N-200i');
      cy.get(bun).should('contain', 'Краторная булка N-200i');

      cy.get('@ingredientsContainer').should('not.contain', 'Филе Люминесцентного тетраодонтимформа');
      cy.addItemToConstructor('Филе Люминесцентного тетраодонтимформа');
      cy.get('@ingredientsContainer').should('contain', 'Филе Люминесцентного тетраодонтимформа');

      cy.get('@ingredientsContainer').should('not.contain', 'Соус традиционный галактический');
      cy.addItemToConstructor('Соус традиционный галактический');
      cy.get('@ingredientsContainer').should('contain', 'Соус традиционный галактический');

      cy.contains('button', 'Оформить заказ').click();
      cy.wait('@createOrder');

      cy.get('[data-cy="modal"]').should('contain', '12345');
      cy.get('[data-cy="modal"]').find('button').click();
      cy.get('[data-cy="modal"]').should('not.exist');

      cy.get('@bunConstructor').should('contain', 'Выберите булки');
      cy.get('@ingredientsConstructor').should('contain', 'Выберите начинку');
    });

    afterEach(() => {
      cy.clearCookie('accessToken');
      cy.clearCookie('refreshToken');
    });
  });
});
