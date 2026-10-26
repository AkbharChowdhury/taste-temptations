export const errorMessageTag = (message) =>  /*html*/ `<div class="alert alert-danger" role="alert">
  <h4 class="alert-heading">Cannot fetch recipe details!</h4>
  <p>Please view message below for more details</p>
  <hr>
  <p class="mb-0">${message}</p>
</div>`;

export const createLi = (text) => {
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(text));
    return li;
}
/**
 * 
 * @returns {DocumentFragment}
 */
export function getTemplateClone(templateSelector) {
    const template = document.querySelector(templateSelector);
    const clone = template.content.cloneNode(true);
    return clone;
};
export const getCheckboxValues = (name) => 
    [...document.querySelectorAll(`input[name="${name}"]:checked`)]
.map(el => el.value);

export function changeMetaData(metaData) {
    const metas = document.getElementsByTagName("meta");
    for (const [key, value] of Object.entries(metaData)) {
        metas[key]['content'] = value;
    }
}