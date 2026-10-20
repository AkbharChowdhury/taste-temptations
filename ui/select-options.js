import { titleCase } from '#utils/helper.js';
const displayItem = (item) => typeof item === 'string' ? titleCase(item) : item;
const renderValue = (value) => `<option value="${value}">${displayItem(value)}</option>`;
export class SelectOptions {
    static selectMenu({ options = [], defaultValue }) {
        const values = options.map(renderValue);
        const defaultOptionValue = `<option value="" selected disabled hidden>${defaultValue}</option>`;
        return [
            defaultOptionValue, 
            ...values
        ].join('');
    }

}