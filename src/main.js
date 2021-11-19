import commender from './cli.js';
import scaper from './scaper.js';
import fs from 'fs';
import path from 'path';

function getSelector(type, selectorText) {
    switch (type) {
        case 'id':
            return '#' + selectorText.trim();
        case 'class':
            return '.' + selectorText.trim();
        case 'root':
            return 'html';
        default:
            return selectorText.trim();
    }
}

(async () => {
    const result = await commender();
    const markdown = await scaper({
        pageUrl: result.pageUrl.trim(),
        entrySelector: getSelector(
            result.pageSelectorType,
            result.entrySelector
        ),
        excludeItems: result.excludeSelector.split(' '),
    });
    let outputPath;
    if (result.outputDir === 'current') {
        outputPath = `${result.outputFileName}.md`;
    } else {
        outputPath = path.join(
            process.cwd(),
            result.outputDir,
            `${result.outputFileName}.md`
        );
    }
    fs.writeFileSync(outputPath, markdown, 'utf-8');
})();

// main-content tie-col-md-8 tie-col-xs-12
//post-footer post-footer-on-bottom

// $('img').each(function () {
//     const img = $(this);
//     const src = $(img).attr('src');
//     Object.keys(this.attribs).forEach(attr => {
//         img.removeAttr(attr);
//     });
//     $(img).attr('src', src);
// });

// turndownService.addRule('formateImageLink', {
//     filter: function (node) {
//         return node.localName.trim() === 'img';
//     },
//     replacement: function (content, node) {
//         return `<img src="${node.getAttribute('src')}"/>`;
//     },
// });

// fs.writeFileSync('./html.md', markdown, 'utf-8');
