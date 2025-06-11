import {faker} from "@faker-js/faker";
// const API_URL = Cypress.env('API_URL');
// const TOKEN = Cypress.env('TOKEN');


export const createFolder = () =>{
    const SPACE_ID = Cypress.env('SPACE_ID');
    return  cy.sendRequest(`/space/${SPACE_ID}/folder`,'POST', {
        name: faker.internet.username(),
    })
}