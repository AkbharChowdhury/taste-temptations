export function renderIntoleranceIcon(icon, library) {
    if (!icon) return '';
    if (library === 'fa') {
        return `<i class="${icon} intolerance-icon" aria-hidden="true"></i>`;
    }
    return `<iconify-icon icon="${icon}" aria-hidden="true"></iconify-icon>`;
}