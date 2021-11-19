import got from 'got';
import cheerio from 'cheerio';
import TurndownService from 'turndown';
import fs from 'fs';

export default async ({ pageUrl, excludeItems, entrySelector }) => {
    try {
        const res = await got(pageUrl.trim());
        const $ = cheerio.load(res.body);

        const itemToExclude = ['script', 'style', 'link', 'meta'].concat(
            excludeItems
        );

        itemToExclude.forEach(item => $(item).remove());

        const turndownService = new TurndownService();
        const entryHtml = $(entrySelector).html();
        if (!entryHtml) {
            console.log('Your Enterd selector not found!');
            process.exit(1);
        }
        return turndownService.turndown(entryHtml);
    } catch (err) {
        console.log(err);
    }
};
