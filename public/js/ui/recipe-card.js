"use strict";

import { getTemplateClone } from './dom.js';
import { formatDuration, DurationFormatStyle } from '../utils/duration.js';

// import { renderIntoleranceIcon } from  '../../../ui/render.js';
// import { intolerances } from  '../../../ui/recipe-tags.js';
// import { intolerances } from '../../../ui/recipe-tags.js';

// console.log({intolerances})

console.log("Trying to import from:", new URL('../../../ui/recipe-tags.js', import.meta.url).href);

const renderCheapBadge = (isCheap) => `<i class="fa-solid fa-${isCheap ? 'tag' : 'tags'}"></i>`;
const recipeDetailURL = (id) => `detail.html?id=${id}`;
const getRecipeImage = (id) => `https://img.spoonacular.com/recipes/${id}-556x370.jpg`;
const getDataSelector = (name) => `[data-${name}]`;

// const dairyItem = intolerances.find(item => item.label === 'Dairy');
// const glutenItem = intolerances.find(item => item.label === 'Gluten');
// console.log({dairyItem})
// console.log({glutenItem})
// console.log(renderIntoleranceIcon(dairyItem.icon, dairyItem.library))
// console.log(renderIntoleranceIcon(glutenItem.icon, glutenItem.library))
function renderDairyBadge(badgeColour = 'danger', text = 'Contains Dairy') {
  // const dairyItem = intolerances.find(item => item.label === 'Dairy');
  const dairyIcon = '<i class="fa-solid fa-cow me-1"></i>';
  // const dairyIcon = renderIntoleranceIcon(dairyItem.icon, dairyItem.library);
  return `<span class="badge rounded-pill text-bg-${badgeColour} text-capitalize">${dairyIcon} ${text}</span>`;
}

export const recipeCard = (recipe, renderContext) => {
  const { selectors } = renderContext;

  const {
    image, title, id, servings,
    aggregateLikes: likes,
    healthScore, readyInMinutes: minutes,
    veryPopular,
    weightWatcherSmartPoints: healthPoints,
    glutenFree,
    cheap,
    dairyFree,
  } = recipe;

  const clone = getTemplateClone(selectors.template);
  const img = clone.querySelector('img');
  img.src = image;
  img.alt = title;

    const badges = {
    glutenFree: clone.querySelector(getDataSelector('gluten-free')),
    dairyFree: clone.querySelector(getDataSelector('dairy-free')),
    popular: clone.querySelector(getDataSelector('popular')),
    cheap: clone.querySelector(getDataSelector('is-cheap')),
  };
  clone.querySelector('.card-title').textContent = title;
  clone.querySelector(getDataSelector('servings')).innerText = servings;
  clone.querySelector(getDataSelector('likes')).innerText = likes.toLocaleString();
  clone.querySelector(getDataSelector('duration')).textContent = formatDuration(minutes, DurationFormatStyle.NARROW);
  clone.querySelector('a').href = recipeDetailURL(id)
  clone.querySelector(getDataSelector('weightWatcherSmartPoints')).innerText = healthPoints;

  clone.querySelector(selectors.healthProgress).value = healthScore;

  // ─── BADGES ───────────────────
  glutenFree && badges.glutenFree.classList.replace('text-bg-danger', 'text-bg-success');

  !veryPopular && badges.popular.remove();
  badges.cheap.innerHTML = renderCheapBadge(cheap);
  

  const dairyData = dairyFree
  ? { badgeColour: 'success', text: 'dairy free' }
  : { badgeColour: 'danger', text: 'contains dairy' };
  badges.dairyFree.innerHTML = renderDairyBadge(dairyData.badgeColour, dairyData.text);

  // badges.dairyFree.innerHTML = !dairyFree ? renderDairyBadge() : renderDairyBadge('success', 'dairy free');


  return clone;

};

export const similarRecipeCard = (recipe, template) => {
  
  const { id, title, readyInMinutes: minutes, servings } = recipe;
  const clone = getTemplateClone(template);

  const img = clone.querySelector('img');
  img.src = getRecipeImage(id);
  img.alt = title;
  img.title = title;
  
  clone.querySelector(getDataSelector('servings')).textContent = `serves ${servings}`;
  clone.querySelector(getDataSelector('title')).textContent = title;
  clone.querySelector(getDataSelector('duration')).textContent = formatDuration(minutes, DurationFormatStyle.SHORT);
  clone.querySelector('a').href = recipeDetailURL(id);

  return clone;

}

