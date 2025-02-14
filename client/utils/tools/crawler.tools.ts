import { createTool } from "@covalenthq/ai-agent-sdk";
import { z } from "zod";
import fetch from "node-fetch";
import * as cheerio from 'cheerio';

export const CrawlerTool = createTool({
    id: "crawler-tool",
    description: "Extract and process content from URLs",
    schema: z.object({
        url: z.string().describe("The URL to crawl"),
        selector: z.string().optional().describe("Optional CSS selector to target specific content")
    }),
    execute: async (parameters: unknown) => {
        const { url, selector } = z.object({
            url: z.string(),
            selector: z.string().optional()
        }).parse(parameters);
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
            }
            
            const html = await response.text();
            const $ = cheerio.load(html);
            
            $('script').remove();
            $('style').remove();
            $('nav').remove();
            $('footer').remove();
            $('header').remove();
            
            let content = '';
            if (selector) {
                content = $(selector).text().trim();
            } else {
                const mainContent = $('main, article, .content, #content, .post-content').first();
                if (mainContent.length) {
                    content = mainContent.text().trim();
                } else {
                    content = $('body').text().trim();
                }
            }
            
            content = content
                .replace(/\s+/g, ' ')
                .replace(/\n+/g, '\n')
                .trim();
            
            const metadata = {
                title: $('title').first().text().trim() || $('h1').first().text().trim(),
                author: $('meta[name="author"]').attr('content') || 
                       $('.author').first().text().trim() || 
                       'Unknown',
                publishDate: $('meta[property="article:published_time"]').attr('content') ||
                           $('time').attr('datetime') ||
                           'Unknown',
                description: $('meta[name="description"]').attr('content') || '',
                url: url
            };
            
            return JSON.stringify({
                title: metadata.title,
                content: content.substring(0, 8000), 
                metadata
            });
            
        } catch (error) {
            return JSON.stringify({
                error: true,
                message: error instanceof Error ? error.message : 'Unknown error occurred',
                url
            });
        }
    }
});