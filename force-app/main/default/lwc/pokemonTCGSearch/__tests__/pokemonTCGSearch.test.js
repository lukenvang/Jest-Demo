import { createElement } from 'lwc';
import PokemonTCGSearch from 'c/pokemonTCGSearch';

describe('c-pokemon-t-c-g-search', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    describe('event actions', () => {
        it('updates query term when enter is pressed', () => {
            const element = createElement('c-pokemon-t-c-g-search', {
                is: PokemonTCGSearch
            });
            document.body.appendChild(element);

            let divElement = element.shadowRoot.querySelector('div');
            divElement.value = 'Charizard';
            divElement.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 13 }));
            expect(element.queryTerm).toBe('Charizard');
        });
    });

    it('calls the clear event when on change with no input value', () => {
        const element = createElement('c-pokemon-t-c-g-search', {
            is: PokemonTCGSearch
        });
        document.body.appendChild(element);

        let inputElement = element.shadowRoot.querySelector('lightning-input');
        inputElement.dispatchEvent(new CustomEvent('change'));
    });

});