
import { titleCase } from '../utils/helper.js';
import { createLi } from './dom.js';

export const createListItems = (items, key) => items.map(item => createLi(item[key]));

export const getIngredientsList = ({ extendedIngredients }) => createListItems(extendedIngredients, 'original');

export const getSteps = ({ steps }) => createListItems(steps, 'step');

const createTagHtml = (tag) => /*html*/ `<span class="badge text-bg-success p-2">${titleCase(tag)}</span>`;

const createTagElement = (tag) => {
        const div = document.createElement('div');
        div.classList.add('p-2');
        div.innerHTML = createTagHtml(tag);
        return div;
}

const getTags = (tags) => {

    const div = document.createElement('div');
    div.className = 'd-flex flex-row mb-3';
    const tagElements = tags.map(createTagElement);
    const fragment = new DocumentFragment();
    for (const tagEl of tagElements){
        fragment.append(tagEl);
    }
    div.appendChild(fragment)
    return div;
}

export function showExtraInfo({ vegan, vegetarian, glutenFree, diets }) {

    const tags = [
        { label: 'vegan', isActive: vegan },
        { label: 'vegetarian', isActive: vegetarian },
        { label: 'gluten free', isActive: glutenFree }

    ].filter(tag => tag.isActive)
    .map(tag => tag.label);


    const container = document.querySelector('#tags-data');
    const hasDiet = diets.length > 0;
    const hasTags = tags.length > 0;
    const dietLabel = `<p class="pt-2">Suitable for diets: <strong>${diets}</strong></p>`;
    
    if (hasTags) container.insertAdjacentElement('beforebegin', getTags(tags));
    if (hasDiet) container.insertAdjacentHTML('beforebegin', dietLabel);
    
    const hasNoContent = !hasTags && !hasDiet;
    const tagsEl = document.querySelector('#tags');
    if (hasNoContent) tagsEl.remove();
    container.remove();

}



