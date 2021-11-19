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
        return turndownService.turndown($(entrySelector).html());
    } catch (err) {
        console.log(err);
    }
};
