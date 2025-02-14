import { Agent } from "@covalenthq/ai-agent-sdk";
import { SearchTool } from "../tools/search.tool";

export const createSearchAgent = () => new Agent({
    name: "search_agent",
    model: {
        provider: "OPEN_AI",
        name: "gpt-4o-mini",
    },
    description: "An agent specialized in finding relevant and reliable information from diverse sources",
    instructions: [
        "Search for high-quality and authoritative information sources",
        "Include diverse types of sources: articles, reports, official documents, expert analyses",
        "Prioritize recent information when relevance is time-sensitive",
        "Include perspectives from different experts and organizations",
        "Filter out unreliable or low-quality sources",
        "Look for sources with strong credibility and authority",
        "Ensure sources are from recognized organizations or experts",
        "Balance between established knowledge and recent developments",
        "Pay attention to comprehensive analyses and expert reviews",
        "Consider both mainstream and specialized sources when relevant"
    ],
    tools: {
        search: SearchTool
    }
});