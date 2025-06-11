// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import { faker } from '@faker-js/faker';
import '@shelex/cypress-allure-plugin';

const API_URL = Cypress.env('API_URL');
const TOKEN = Cypress.env('TOKEN');
const SPACE_ID = Cypress.env('SPACE_ID');


Cypress.Commands.add('sendRequest', (endpoint,method,body=null, options = {}) => {
    return cy.request({
        url: `${API_URL}${endpoint}`,
        method: method,
        headers:{
            Authorization: TOKEN,
            'Content-Type': 'application/json',
        },
        body: body,
        ...options
    })
})
Cypress.Commands.add('createFolder', () => {
    return cy.sendRequest(`/space/${SPACE_ID}/folder`, 'POST', {
        name: faker.internet.username(),
    });
});
Cypress.Commands.add('updateFolder', (folderId, updateBody) => {
    return cy.sendRequest(`/folder/${folderId}`, 'PUT', updateBody)
})
Cypress.Commands.add('deleteFolder', (folderId) => {
    return cy.sendRequest(`/folder/${folderId}`, 'DELETE');
});
