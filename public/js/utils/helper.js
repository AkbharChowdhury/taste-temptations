export const titleCase = (sentence) => sentence
    .toLowerCase()
    .split(' ')
    .map(word => word.replace(word[0], word[0].toUpperCase()))
    .join(' ');

export const sortedArray = (arr=[]) => arr.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
export const getRandomItem = (arr=[]) => arr[(Math.random() * arr.length) | 0];
export const isValidNumber = (num) => !isNaN(num) || num !== 0;