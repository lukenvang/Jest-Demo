import { LightningElement, api } from 'lwc';

export default class PokemonTCGSearch extends LightningElement {

    @api queryTerm;

    handleKeyUp(evt) {
        const isEnterKey = evt.keyCode === 13;
        if (isEnterKey && evt.target.value.length > 3) 
        {
            this.queryTerm = evt.target.value;
            this.dispatchEvent(new CustomEvent('search',  { detail: this.queryTerm }));
        }
    }

    handleChange(evt)
    {
        if(!evt.target.value)
        {
            this.dispatchEvent(new CustomEvent('clear'));
        }
    }
    
}