"use strict";

import {
    paymentIsRequired,
    apiRequest,
} from './utils/api.js';

import {
    titleCase,
    isValidNumber,
} from './utils/helper.js';


import {
    changeMetaData,
    getTemplateClone,
    errorMessageTag,
} from './ui/dom.js';

import { formatDuration } from './utils/duration.js';
import { similarRecipeCard } from './ui/recipe-card.js';
import {
    createListItems,
    showExtraInfo,
} from './ui/detail-snippets.js';


const recipeId = fetchRecipeID();

const endpoints = {
    details: 'detail',
    similar: 'similar',
    nutritionLabel: 'nutrition-label',
};

const api = {
    details: (recipeId) => apiRequest(endpoints.details, recipeId),
    similar: (recipeId) => apiRequest(endpoints.similar, recipeId),
};

const renderContext = {
    selectors: {
        container: '#similar-recipe-list',
        template: '#similar-recipes-template',
        dishTemplate: '#dish-types-template',
        dishList: '#dish-list',
    }
};

(function () {
    if (isValidNumber(recipeId)) {
        api.details(recipeId)
            .then(handleRecipeDetails)
            .catch(console.error);
    }

})();

function fetchRecipeID() {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get('id');
    return id ? Number(id) : 0;
}

function renderDishTags(dishes = []) {
    const { dishList, dishTemplate } = renderContext.selectors;
    const container = document.querySelector(dishList);
    const fragment = new DocumentFragment();

    for (const dish of dishes) {
        const tag = getTemplateClone(dishTemplate);
        tag.querySelector('span').textContent = titleCase(dish);
        fragment.append(tag);
        
    }
    
    container.replaceChildren(fragment);
}

const renderSimilarRecipeList = (recipes) => {
    const container = document.querySelector(renderContext.selectors.container);
    const fragment = new DocumentFragment();

    for (const recipe of recipes) {
        fragment.appendChild(similarRecipeCard(recipe, renderContext.selectors.template));
    }

    container.replaceChildren(fragment);
};



const loadSimilarRecipes = (recipeId) => api.similar(recipeId).then(renderSimilarRecipeList);

function handleRecipeDetails(response) {

    const { status, message } = response
    if (paymentIsRequired(status)) {
        const errorEl = document.querySelector('#recipe-details-container');
        errorEl.innerHTML = errorMessageTag(message);
        return;
    }

    displayRecipeDetails(response);

    getNutritionLabel(endpoints.nutritionLabel, recipeId).then(displayNutritionLabel);
    loadSimilarRecipes(recipeId);
}



async function getNutritionLabel(url, id) {
    try {
        const response = await axios.post(url, { id });
        return response.data;
    } catch (error) {
        console.error('There was an error fetching nutrition label', error);
    }
}

function displayNutritionLabel(nutritionHtml) {
    const nutritionLabel = nutritionHtml.split('</style>')[1];
    const container = document.querySelector('#nutrition-label-widget');
    container.insertAdjacentHTML('afterbegin', nutritionLabel);
}

function displayRecipeDetails(recipeData) {
    const {
        title,
        image,
        cuisines,
        summary,
        servings,
        readyInMinutes: minutes,
        dishTypes,
        analyzedInstructions,
        extendedIngredients,
    } = recipeData;

    const titleEl = document.querySelector('#title');
    const imgEl = document.querySelector('#image');
    const summaryEl = document.querySelector('#summary');
    const additionDetailsEl = document.querySelector('#additional-details');

    const cuisinesLabel = cuisines.length > 0 ? `| ${cuisines.join(', ')}` : '';
    const additionalDetails = `Serves ${servings}, ready in ${formatDuration(minutes)} ${cuisinesLabel}`;
    const ingredients = createListItems(extendedIngredients, 'original');

    document.title = `Taste Temptations: ${title}`;

    changeMetaData({ description: summary, keywords: title });

    titleEl.textContent = title;
    additionDetailsEl.innerText = additionalDetails;

    renderDishTags(dishTypes);
    showExtraInfo(recipeData);

    imgEl.src = image;
    imgEl.alt = title;

    summaryEl.innerHTML = summary;

    appendNodes({ selector: '#ingredients', items: ingredients });

    const instructions = analyzedInstructions[0];

    if (instructions === undefined) {
        hideSteps();
        return;
    }
    showInstructions(instructions);
}

function appendNodes({ selector, items }) {

    const fragment = new DocumentFragment();
    const container = document.querySelector(selector);
    for (const item of items) {
        fragment.append(item)
    }
    container.append(fragment);
}

function showInstructions(instructions) {
    const { steps } = instructions;

    const showSteps = () => appendNodes({ selector: '#steps', items: createListItems(steps, 'step') });
    showSteps();
}

function hideSteps() {
    const instructionIds = ['instructions-header', 'steps', 'hr'];
    const hideElement = (id) => document.getElementById(id).style.display = 'none';
    instructionIds.forEach(hideElement);
}
