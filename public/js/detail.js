"use strict";
// API
import {
    paymentIsRequired,
    apiRequest,
} from './utils/api.js';

// Utils
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

// UI
import { similarRecipeCard } from './ui/recipe-card.js';

// Detail-specific logic
import {
    createListItems,
    showExtraInfo,
} from './ui/detail-snippets.js';

import  { appendNodes } from './ui/dom.js';

const id = fetchRecipeID();

const endpoints = {
    details: 'detail',
    similar: 'similar',
    nutritionLabel: 'nutrition-label',
};

const api = {
    details: (id) => apiRequest(endpoints.details, id),
    similar: (id) => apiRequest(endpoints.similar, id),
};


const renderContext = {
    selectors: {
        container: '#similar-recipe-list',
        template: '#similar-recipes-template',
    }
};

function fetchRecipeID() {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get('id');
    return id ? Number(id) : 0;
}

function renderDishTags(dishes = []) {
    const container = document.querySelector('#dish-list');
    const fragment = new DocumentFragment();
    for (const dish of dishes) {
        const tag = getTemplateClone('#dish-types-template');
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

    container.append(fragment);
};



const loadSimilarRecipes = (id) => api.similar(id)
.then(recipes => renderSimilarRecipeList(recipes));

(function () {

    if (isValidNumber(id)) {
        api.details(id)
            .then(handleRecipeDetails)
            .catch(console.error);
    }

})();


    
function handleRecipeDetails(response) {

    const { status, message } = response
    if (paymentIsRequired(status)) {
        const errorDiv = document.querySelector('#recipe-details-container');
        errorDiv.innerHTML = errorMessageTag(message);
        return;
    }

    displayRecipeDetails(response);

    getNutritionLabel(endpoints.nutritionLabel, id).then(displayNutritionLabel);
    loadSimilarRecipes(id);
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
    const cuisinesLabel = cuisines.length > 0 ? `| ${cuisines.join(', ')}` : '';
    const additionalDetails = `Serves ${servings}, ready in ${formatDuration(minutes)} ${cuisinesLabel}`;
    const ingredients = createListItems(extendedIngredients, 'original');
    
    document.title = `Taste Temptations: ${title}`;

    changeMetaData({ description: summary, keywords: title });

    titleEl.textContent = title;
    document.querySelector('#additional-details').innerText = additionalDetails;

    renderDishTags(dishTypes);
    showExtraInfo(recipeData);

    imgEl.src = image;
    imgEl.alt = title;

    document.querySelector('#summary').innerHTML = summary;
    appendNodes('#ingredients', ingredients);

    const instructions = analyzedInstructions[0];

    if (instructions === undefined) {
        hideSteps();
        return;
    }
    showInstructions(instructions);
}

function showInstructions(instructions) {
    const { steps } = instructions;
    const showSteps = () => appendNodes('#steps', createListItems(steps, 'step'));
    showSteps();
}

function hideSteps() {

    const instructionSection = {
        'header': 'instructions-header',
        'steps': 'steps',
        'hr': 'hr',
    }

    const hideElement = (el) => document.querySelector(`#${el}`).style.display = 'none';
    Object.values(instructionSection).forEach(hideElement);
}