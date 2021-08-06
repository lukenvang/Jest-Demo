import { createElement } from 'lwc';
import PokemonTCG from 'c/pokemonTCG';
import getAllCards from '@salesforce/apex/PokemonTCG.getAllCards';
import searchCardsByName from '@salesforce/apex/PokemonTCG.searchCardsByName';
import { registerApexTestWireAdapter } from '@salesforce/sfdx-lwc-jest';

// Realistic data with a list of contacts
const recordsMock = require('./data/pokemon.json');

// An empty list of records to verify the component does something reasonable
// when there is no data to display
const noRecordsMock = require('./data/pokemonNoData.json');

// Register as Apex wire adapter. Some tests verify that provisioned values trigger desired behavior.
const getAllCardsAdapter = registerApexTestWireAdapter(getAllCards);

//jest.mock(moduleName, factory, options)
//jest.mock (module name, jest.fn() : mocks function ( our apex function ), virtual:true = mocks of modules that don't exist anywhere in the system )
//searchCardsByName.mockResolvedValue(JSON);
//searchCardsByName.mockRejectedValue(JSON);

//mock function for search cards by name
jest.mock('@salesforce/apex/PokemonTCG.searchCardsByName',
    () => ({
        default: jest.fn()
    }),
    { virtual: true }
)

//mock function for get all cards
jest.mock('@salesforce/apex/PokemonTCG.getAllCards',
    () => ({
        default: jest.fn()
    }),
    { virtual: true }
)

//top level test suite
describe('c-pokemon-t-c-g', () => {

    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
    });

    //test suite to test apex function calls
    describe('apex calls success', () => {

        //test Method
        it('renders all mock record entries', () => {
            const element = createElement('c-pokemon-t-c-g', {
                is: PokemonTCG
            });

            document.body.appendChild(element);

            // Emit data from @wire
            getAllCardsAdapter.emit(JSON.stringify(recordsMock));

            return Promise.resolve().then(() => {
                // Select elements for validation
                const divElements = element.shadowRoot.querySelectorAll('div');
                expect(divElements.length).toBe(recordsMock.data.length);
                expect(divElements[0].childNodes.length > 0).toBeTruthy
            });
        });

        //test Method
        it('dispatches search event and renders entries', () => {
            searchCardsByName.mockResolvedValue(JSON.stringify(recordsMock));
            const element = createElement('c-pokemon-t-c-g', {
                is: PokemonTCG
            });

            document.body.appendChild(element);

            // Select rendered child for length check
            const childElem = element.shadowRoot.querySelector('c-pokemon-t-c-g-search');

            // Set the payload of the event
            const eventPayload = { detail: 'Charizard' };

            childElem.dispatchEvent(new CustomEvent('search', eventPayload));

            //setImmediate is required for all imperative methods 
            return new Promise(setImmediate).then(() => {
                const divElements = element.shadowRoot.querySelectorAll('div');
                expect(divElements.length).toBe(recordsMock.data.length);
                expect(divElements[0].childNodes.length > 0).toBeTruthy
            });

        });

        it('dispatches clear event and re-renders entries', () => {
            getAllCards.mockResolvedValue(JSON.stringify(recordsMock));
            const element = createElement('c-pokemon-t-c-g', {
                is: PokemonTCG
            });

            document.body.appendChild(element);

            // Select rendered child for length check
            const childElem = element.shadowRoot.querySelector('c-pokemon-t-c-g-search');

            childElem.dispatchEvent(new CustomEvent('clear'));

            //setImmediate is required for all imperative methods 
            return new Promise(setImmediate).then(() => {
                const divElements = element.shadowRoot.querySelectorAll('div');
                expect(divElements.length).toBe(recordsMock.data.length);
                expect(divElements[0].childNodes.length > 0).toBeTruthy
            });

        });

    });


    //test suite to test apex function calls
    describe('apex calls errors', () => {

          //test Method
          it('recieves a error on wire method', () => {
            const element = createElement('c-pokemon-t-c-g', {
                is: PokemonTCG
            });

            document.body.appendChild(element);

            // Emit data from @wire
            getAllCardsAdapter.error();

            return Promise.resolve().then(() => {
                // Select elements for validation
                const divElements = element.shadowRoot.querySelectorAll('div');
                expect(divElements.length).not.toBe(recordsMock.data.length);
            });
        });

        //test Method
        it('dispatches search event but has error', () => {
            searchCardsByName.mockRejectedValue(JSON.stringify(noRecordsMock));
            const element = createElement('c-pokemon-t-c-g', {
                is: PokemonTCG
            });

            document.body.appendChild(element);

            // Select rendered child for length check
            const childElem = element.shadowRoot.querySelector('c-pokemon-t-c-g-search');

            // Set the payload of the event
            const eventPayload = { detail: 'Charizard' };

            childElem.dispatchEvent(new CustomEvent('search', eventPayload));

            //setImmediate is required for all imperative methods 
            return new Promise(setImmediate).then(() => {
                const divElements = element.shadowRoot.querySelectorAll('div');
                expect(divElements.length).not.toBe(recordsMock.data.length);
            });

        });

        it('dispatches clear event but has error', () => {
            getAllCards.mockRejectedValue(JSON.stringify(noRecordsMock));
            const element = createElement('c-pokemon-t-c-g', {
                is: PokemonTCG
            });

            document.body.appendChild(element);

            // Select rendered child for length check
            const childElem = element.shadowRoot.querySelector('c-pokemon-t-c-g-search');

            childElem.dispatchEvent(new CustomEvent('clear'));

            //setImmediate is required for all imperative methods 
            return new Promise(setImmediate).then(() => {
                const divElements = element.shadowRoot.querySelectorAll('div');
                expect(divElements.length).not.toBe(recordsMock.data.length);
            });

        });
    });


});