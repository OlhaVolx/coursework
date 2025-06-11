import {faker} from '@faker-js/faker';
import { createFolder } from '../../../module/folders.js';
import '@shelex/cypress-allure-plugin';

describe('CheckCRUD lifecycle for folders', () => {
  let folderId = null;
  const SPACE_ID = Cypress.env('SPACE_ID');
  const API_URL = Cypress.env('API_URL');
  const TOKEN = Cypress.env('TOKEN');

  it('Send Get request and return 200 code', () => {

    // 1. Створення папки
    cy.allure().step('Створення папки');
    createFolder().then((response) => {
      expect(response.status).to.eq(200);
      console.log('Create folder response:', response.body);
      folderId = response.body.id;

      // 2. Перевірка, що папка створена
      cy.allure().step('Перевірка наявності папки');
      cy.sendRequest(`/space/${SPACE_ID}/folder`, 'GET').then((getResponse) => {
        expect(getResponse.status).to.eq(200);
        const found = getResponse.body.folders.some(g => g.id === folderId);
        expect(found).to.be.true;

           // 3. Оновлення папки
          cy.allure().step('Оновлення папки');
          cy.updateFolder(folderId, {name: faker.internet.username()})
            .then((updateResponse) => {
              expect(updateResponse.status).to.eq(200);


              // 4. Видалення папки
              cy.allure().step('Видалення папки');
              cy.deleteFolder(folderId).then((deleteResponse) => {
                expect(deleteResponse.status).to.eq(200);

                // 5. Перевірка, що папка видалена
                cy.allure().step('Перевірка, що папка видалена');
                cy.sendRequest(`/folder/${folderId}`, 'GET', null, {failOnStatusCode: false}).then((deletedFolderResponse) => {
                  expect(deletedFolderResponse.status).to.eq(200);
                  expect(deletedFolderResponse.body.deleted).to.eq(true);
                });
              })
            })
      })
    })
  })

  it('Send Get request with invalid token ', () => {

    // 1. Створення папки
    cy.createFolder().then((response) => {
      expect(response.status).to.eq(200);
      console.log('Create folder response:', response.body);
      folderId = response.body.id;

      //2. GET запит з невалідним токеном
      cy.request({
        url: `${API_URL}/space/${SPACE_ID}/folder`,
        method: 'GET',
        headers: {
          Authorization: "invalid_188620723_KIOELYZKBXGAQTS9L69ECYOAI223V9HX"
        },
        failOnStatusCode: false
      }).then((getResponse) => {
        expect(getResponse.status).to.eq(401);

        // 3. Видалення папки
        cy.deleteFolder(folderId).then((deleteResponse) => {
          expect(deleteResponse.status).to.eq(200);

          // 4. Перевірка, що папка видалена
          cy.sendRequest(`/folder/${folderId}`, 'GET', null, {failOnStatusCode: false}).then((deletedFolderResponse) => {
            expect(deletedFolderResponse.status).to.eq(200);
            expect(deletedFolderResponse.body.deleted).to.eq(true);
          })
        })

      })
    })
  })

  it('Send Get request with invalid space_id', () => {

    // 1. Створення папки
    cy.createFolder().then((response) => {
      expect(response.status).to.eq(200);
      console.log('Create folder response:', response.body);
      folderId = response.body.id;

      //2. GET запит з невалідним айді
      const randomSpaceId = faker.string.numeric(6);
      cy.request({
        url: `${API_URL}/space/${randomSpaceId}/folder`,
        method: 'GET',
        headers: {
          Authorization: TOKEN,
        },
        failOnStatusCode: false
      }).then((getResponse) => {
        expect([400, 401, 404]).to.include(getResponse.status) // 400, 401, 404 тому що залежно від того як згенерує браузер, може бути різний статус код

        // 3. Видалення папки
        cy.deleteFolder(folderId).then((deleteResponse) => {
          expect(deleteResponse.status).to.eq(200);

          // 4. Перевірка, що папкa видалена
          cy.sendRequest(`/folder/${folderId}`, 'GET', null, {failOnStatusCode: false}).then((deletedFolderResponse) => {
            expect(deletedFolderResponse.status).to.eq(200);
            expect(deletedFolderResponse.body.deleted).to.eq(true);
          })
        })
      })
    })
  })

  it('Send POST request with invalid token ', () => {
    cy.request({
      url: `${API_URL}/space/${SPACE_ID}/folder`,
      method: 'POST',
      headers: {
        Authorization: "invalid_188620723_KIOELYZKBXGAQTS9L69ECYOAI223V9HX",
        'Content-Type': 'application/json',
      },
      failOnStatusCode: false
    }).then((getResponse) => {
      expect(getResponse.status).to.eq(401);
    })
  })
  it('Send POST request with incorect spaceId ', () => {
    const randomSpaceId = faker.string.numeric(6)
    cy.request({
      url: `${API_URL}/space/${randomSpaceId}/folder`,
      method: 'POST',
      headers: {
        Authorization: TOKEN,
        'Content-Type': 'application/json',
      },
      failOnStatusCode: false,
      body: {
        name: faker.internet.username(),
      }
    }).then((getResponse) => {
      expect([400, 401, 404]).to.include(getResponse.status) // 400, 401, 404 тому що залежно від того як згенерує браузер, може бути різний статус код
    })
  })
  it('Send PUT request with invalid token  ', () => {

    // 1. Створення папки
    cy.createFolder().then((response) => {
      expect(response.status).to.eq(200);
      console.log('Create folder response:', response.body);
      folderId = response.body.id;

      // 2. Перевірка, що папкa створена
      cy.sendRequest(`/space/${SPACE_ID}/folder`, 'GET').then((getResponse) => {
        expect(getResponse.status).to.eq(200);
        const found = getResponse.body.folders.some(g => g.id === folderId);
        expect(found).to.be.true;
        // 3. Оновлення цілі з невалідним токеном
        cy.request({
          url: `${API_URL}/folder/${folderId}`,
          method: 'PUT',
          headers: {
            Authorization: "invalid_188620723_KIOELYZKBXGAQTS9L69ECYOAI223V9HX"
          },
          failOnStatusCode: false
        }).then((getResponse) => {
          expect(getResponse.status).to.eq(401);

          // 4. Видалення папки
          cy.deleteFolder(folderId).then((deleteResponse) => {
            expect(deleteResponse.status).to.eq(200);

            // 4. Перевірка, що папкa видалена
            cy.sendRequest(`/folder/${folderId}`, 'GET', null, {failOnStatusCode: false}).then((deletedFolderResponse) => {
              expect(deletedFolderResponse.status).to.eq(200);
              expect(deletedFolderResponse.body.deleted).to.eq(true);
            })
          })
        })
      })
    })
  })

  it('Send Delete request with invalid token  ', () => {

    // 1. Створення папки
    cy.createFolder().then((response) => {
      expect(response.status).to.eq(200);
      console.log('Create folder response:', response.body);
      folderId = response.body.id;

      // 2. Перевірка, що папкa створена
      cy.sendRequest(`/space/${SPACE_ID}/folder`, 'GET').then((getResponse) => {
        expect(getResponse.status).to.eq(200);
        const found = getResponse.body.folders.some(g => g.id === folderId);
        expect(found).to.be.true;

        // 3. Оновлення папки
        cy.updateFolder(folderId, {name: faker.internet.username()})
            .then((updateResponse) => {
              expect(updateResponse.status).to.eq(200);

              // 4. Видалення з невалідним токеном
              cy.request({
                url: `${API_URL}/folder/${folderId}`,
                method: 'DELETE',
                headers: {
                  Authorization: "invalid_188620723_KIOELYZKBXGAQTS9L69ECYOAI223V9HX"
                },
                failOnStatusCode: false
              }).then((getResponse) => {
                expect(getResponse.status).to.eq(401);

                // 5. Видалення папки
                cy.deleteFolder(folderId).then((deleteResponse) => {
                  expect(deleteResponse.status).to.eq(200);

                  // 6. Перевірка, що папкa видалена
                  cy.sendRequest(`/folder/${folderId}`, 'GET', null, {failOnStatusCode: false}).then((deletedFolderResponse) => {
                    expect(deletedFolderResponse.status).to.eq(200);
                    expect(deletedFolderResponse.body.deleted).to.eq(true);
                  })
                })
              })
            })
      })
    })
  })

  it('Send Get Folder request with invalid token  ', () => {

    // 1. Створення папки
    cy.createFolder().then((response) => {
      expect(response.status).to.eq(200);
      console.log('Create folder response:', response.body);
      folderId = response.body.id;

      // 2. GET запит з невалідним токеном
      cy.request({
        url: `${API_URL}/folder/${folderId}`,
        method: 'GET',
        headers: {
          Authorization: "invalid_188620723_KIOELYZKBXGAQTS9L69ECYOAI223V9HX"
        },
        failOnStatusCode: false
      }).then((getResponse) => {
        expect(getResponse.status).to.eq(401);

        // 3. Видалення папки
        cy.deleteFolder(folderId).then((deleteResponse) => {
          expect(deleteResponse.status).to.eq(200);

          // 4. Перевірка, що папкa видалена
          cy.sendRequest(`/folder/${folderId}`, 'GET', null, {failOnStatusCode: false}).then((deletedFolderResponse) => {
            expect(deletedFolderResponse.status).to.eq(200);
            expect(deletedFolderResponse.body.deleted).to.eq(true);
          })
        })
      })
    })
  })
})