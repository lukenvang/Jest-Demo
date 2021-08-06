import { LightningElement, wire, api } from 'lwc';
import getAllCards from '@salesforce/apex/PokemonTCG.getAllCards';
import searchCardsByName from '@salesforce/apex/PokemonTCG.searchCardsByName';

//jest example 
//testing apex wire
//testing imperative apex function call
export default class PokemonTCG extends LightningElement {

    cards;
    loading = true;

    @wire(getAllCards)
    allCards({ error, data }) {
        this.loading = false;
        if (data) {
            this.cards = JSON.parse(data).data;
        } else if (error) {
            console.error(error);
        }
    }

    handleSearch(event) {
        this.loading = true;
        let name = event.detail;
        searchCardsByName({ searchCriteria: name }).then(result => {
            this.cards = JSON.parse(result).data;
            this.loading = false;
        }).catch(error => {
            console.error(error);
            this.loading = false;
        });
    }

    handleClear(event) {
        this.loading = true;
        getAllCards().then(result => {
            this.cards = JSON.parse(result).data;
            this.loading = false;
        }).catch(error => {
            console.error(error);
            this.loading = false;
        });
    }
}