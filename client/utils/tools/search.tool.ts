import { createTool } from "@covalenthq/ai-agent-sdk";
import { z } from "zod";
import fetch from "node-fetch";

interface SearchResult {
    title: string;
    link: string;
    snippet: string;
    position: number;
}

export const SearchTool = createTool({
    id: "search",
    description: "Search for comprehensive information on any given topic",
    schema: z.object({
        query: z.string().describe("The search query"),
        maxResults: z.number().describe("Number of results to return")
    }),
    execute: async (parameters: unknown) => {
        const { query, maxResults } = z.object({
            query: z.string(),
            maxResults: z.number()
        }).parse(parameters);

        const SERPER_API_KEY = process.env.SERPER_API_KEY;
        if (!SERPER_API_KEY) {
            throw new Error("SERPER_API_KEY environment variable is not set");
        }

        try {
            const response = await fetch('https://google.serper.dev/search', {
                method: 'POST',
                headers: {
                    'X-API-KEY': SERPER_API_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    q: query,
                    num: maxResults
                })
            });

            if (!response.ok) {
                throw new Error(`Search API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            const results: SearchResult[] = data.organic.map((result: any, index: number) => ({
                title: result.title,
                link: result.link,
                snippet: result.snippet,
                position: index + 1
            }));

            return JSON.stringify(results.slice(0, maxResults));
        } catch (error) {
            return JSON.stringify({
                error: "Search failed",
                message: error instanceof Error ? error.message : "Unknown error occurred"
            });
        }
    }
});