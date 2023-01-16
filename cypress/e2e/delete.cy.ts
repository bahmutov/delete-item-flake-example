it('deletes the items after the test', () => {
  // reset the backend data by making an API call
  // https://on.cypress.io/request
  const todos = Cypress._.range(1, 5).map((k) => {
    return {
      id: `id_${k + 1000}`,
      title: `todo ${k}`,
    }
  })
  cy.request('POST', '/reset', { todos })
  // visit the application
  // https://on.cypress.io/visit
  cy.visit('/')
  // confirm the application shows the loaded todo items
  cy.get('li.todo').should('have.length', todos.length)
  cy.log('**cleaning up**')
  // remove every todo by clicking on the "destroy" button
  // one by one and waiting for the UI to remove it
  cy.intercept('DELETE', '/todos/*').as('del')
  todos.forEach((todo, k) => {
    cy.get('li.todo .destroy:first').click({ force: true })
    cy.wait('@del')
    cy.get('li.todo').should(
      'have.length',
      todos.length - k - 1,
    )
  })
})

it('has zero todos', () => {
  // the previous test should have deleted all todos
  // but occasionally it leaves on todo remaining
  // breaking this test... why?
  // Can you fix the previous test to truly clean up after itself?
  cy.visit('/')
  cy.get('.loaded')
  cy.get('li.todo').should('have.length', 0)
})
