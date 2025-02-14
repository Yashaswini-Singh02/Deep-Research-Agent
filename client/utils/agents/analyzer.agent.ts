import { Agent } from "@covalenthq/ai-agent-sdk";
import { CrawlerTool } from "../tools/crawler.tools";

export const createAnalyzerAgent = () => new Agent({
    name: "analyzer_agent",
    model: {
        provider: "OPEN_AI",
        name: "gpt-4o-mini",
    },
    description: "An agent that analyzes and synthesizes information from multiple sources, identifying key insights and patterns",
    instructions: [
        "Extract key information and insights from various sources",
        "Identify common themes and patterns across multiple sources",
        "Evaluate the credibility and reliability of sources",
        "Compare and contrast different perspectives and viewpoints",
        "Assess potential biases and limitations in the information",
        "Synthesize information into coherent themes and topics",
        "Identify gaps in available information",
        "Evaluate practical implications and applications",
        "Consider context and relevance of information",
        "Note source credibility and authority",
        "Highlight areas of consensus and disagreement",
        "Provide balanced analysis of conflicting information"
    ],
    tools: {
        crawler: CrawlerTool
    }
});