
import { SelectOptions } from './select-options.js';
import { mealTypes, cuisines, intolerances } from './recipe-tags.js';
import { sortedArray } from '#utils/helper.js';

const sortIcons = (a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase());
export const renderCuisines = () =>
    sortedArray(cuisines)
        .map(renderCuisine).join('');
export const renderIntolerances = () =>
    intolerances
        .sort(sortIcons)
        .map(renderIntolerance)
        .join('');

export const renderMeals = () =>
    SelectOptions.selectMenu({
        options: sortedArray(mealTypes),
        defaultValue: 'No preference'
    });

const renderCuisine = (cuisine) =>/*html*/ `<div class="form-check">
            <input class="form-check-input" type="checkbox" value="${cuisine}" id="${cuisine}" name="cuisines">
            <label class="form-check-label" for="${cuisine}">
                ${cuisine}
            </label>
        </div>`;

function renderIcon(icon, library) {
    if (!icon) return '';
    if (library === 'fa') {
        return `<i class="${icon} intolerance-icon" aria-hidden="true"></i>`;
    }
    return `<iconify-icon icon="${icon}" aria-hidden="true"></iconify-icon>`;
}
const renderIntolerance = ({ label: intolerance, icon, library }) => {
    const iconMarkup = renderIcon(icon, library);
    return /*html*/`<span class="p-2">
<input type="checkbox" class="btn-check" id="${intolerance}" autocomplete="off" name="intolerances" value="${intolerance}">
<label class="btn btn-outline-danger mt-2" for="${intolerance}">${iconMarkup} ${intolerance}</label> 
</span>`;
};
