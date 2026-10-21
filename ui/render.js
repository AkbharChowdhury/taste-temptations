
import { SelectOptions } from '#public_ui/select-options.js';
import { mealTypes, cuisines, intolerances } from '#public_ui/recipe-tags.js';
import { sortedArray } from '#utils/helper.js';
import { renderIntoleranceIcon } from '#public_ui/render-intolerance-icon.js';


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


const renderIntolerance = ({ label: intolerance, icon, library }) => {
    const iconMarkup = renderIntoleranceIcon(icon, library);
    return /*html*/`<span class="p-2">
<input type="checkbox" class="btn-check" id="${intolerance}" autocomplete="off" name="intolerances" value="${intolerance}">
<label class="btn btn-outline-danger mt-2" for="${intolerance}">${iconMarkup} ${intolerance}</label> 
</span>`;
};
