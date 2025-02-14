import { Agent } from "@covalenthq/ai-agent-sdk";
import { CrawlerTool } from "../tools/crawler.tools";

export const createCrawlerAgent = () => new Agent({
    name: "crawler_agent",
    model: {
        provider: "OPEN_AI",
        name: "gpt-4o-mini",
    },
    description: "An agent specialized in extracting and processing content from various online sources",
    instructions: [
        "Extract relevant content from various types of online sources",
        "Clean and format extracted content for better readability",
        "Focus on main content and key information",
        "Handle different website formats and structures",
        "Preserve important formatting and source attribution",
        "Remove irrelevant elements like ads and navigation",
        "Extract images, tables, and multimedia content when available",
        "Maintain proper content organization and structure",
        "Identify and extract source information and dates",
        "Handle different content types appropriately",
        "Extract metadata like authors, publication dates, and source details"
    ],
    tools: {
        crawler: CrawlerTool
    }
});
