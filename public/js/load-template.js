(async () => {
    const templates = await loadTemplates();
     templates.forEach(({ selector, html }) => {
        const el = document.querySelector(selector);
        el?.insertAdjacentHTML("beforebegin", html);
        el?.remove();
    });

    document.querySelector('#load-template')?.remove();
})();

async function loadTemplates() {
    const templateFolder = 'template';
    const targets = [
        { selector: '#header', file: 'header.html' },
        { selector: '#footer', file: 'footer.html' },
    ];

    try {
        const templates = await Promise.all(
            targets.map(async ({ selector, file }) => {
                const response = await fetch(`${templateFolder}/${file}`);
                const html = await response.text();
                return { selector, html };
            })
        );
        
        return templates;

    } catch (err) {
        console.error('Error loading templates:', err);
        return [];
    }
}