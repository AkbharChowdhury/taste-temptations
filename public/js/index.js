"use strict";
// UI
import { clearRecipes } from './ui/recipe-template.js';

import { recipeCard } from './ui/recipe-card.js';

import { renderSearchForm } from './ui/search-form.js';


// API
import { apiRequest, paymentIsRequired } from './utils/api.js';


// Utils
import { constructSearchURLParams } from './ui/search.js';
import {  errorMessageTag, getTemplateClone } from './ui/dom.js';


const NO_RECIPES_FOUND_MESSAGE = "Whoops, we couldn't find any recipes...";
const searchFormEl = document.querySelector('form');
const errorEl = document.querySelector('#error-tag');

const endpoints = {
    random: 'random',
    search: 'search',
};

const api = {
    random: () => apiRequest(endpoints.random),
    search: (params) => apiRequest(`${endpoints.search}?${params.toString()}`),
};

const renderContext = {
    selectors: {
        container: '#recipe-list',
        template: '#recipe-list-template',
        healthProgress: 'circle-progress',
    }
};

const renderRecipeList = (recipes) => {

    const container = document.querySelector(renderContext.selectors.container);
    const fragment = new DocumentFragment();

    for (const recipe of recipes) {
        fragment.append(recipeCard(recipe, renderContext));
    }

    container.append(fragment);
};

(function () {
    renderSearchForm();
    
    api.random()
    .then(({ recipes }) => renderRecipeList(recipes))
    .catch(handleRandomRecipesError);

})();


function handleRandomRecipesError(err) {
    document.querySelector('#button-search').disabled = true;
    showError(err.message || 'Failed to fetch random recipes');
    throw err;
}


function showError(msg) {
    clearRecipes();
    errorEl.innerHTML = errorMessageTag(msg);
}
searchFormEl.addEventListener('submit', async (e) => {

    e.preventDefault();
    errorEl.innerHTML = '';

    try {
        const params = constructSearchURLParams();
        const { results: recipes, code, message } = await api.search(params);

        if (paymentIsRequired(code)) {
            showError(message);
            return;
        }
        
        const hasRecipes = Array.isArray(recipes) && recipes.length > 0;

        if (!hasRecipes) {
            showError(NO_RECIPES_FOUND_MESSAGE);
            return;
        }
        
        showFilteredRecipes(recipes);

    } catch (error) {
        errorEl.innerHTML = errorMessageTag(error.message);
    }
});

function showFilteredRecipes(recipes) {
    clearRecipes();
    renderRecipeList(recipes);
}