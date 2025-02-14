import { ZeeWorkflow } from "@covalenthq/ai-agent-sdk";
import { createSearchAgent } from "./agents/search.agent";
import { createAnalyzerAgent } from "./agents/analyzer.agent";
import { createWriterAgent } from "./agents/writer.agent";
import { createCrawlerAgent } from "./agents/crawler.agent";
import { user } from "@covalenthq/ai-agent-sdk/dist/core/base";
import "dotenv/config";
import { ZeeWorkflowState } from "@covalenthq/ai-agent-sdk/dist/core/state";

export const createDeepResearchWorkflow = (query: string) => {
    const searchAgent = createSearchAgent();
    const analyzerAgent = createAnalyzerAgent();
    const writerAgent = createWriterAgent();
    const crawlerAgent = createCrawlerAgent();

    return new ZeeWorkflow({
        description: `Conduct an extensive and thorough research analysis on: ${query}. 
                     The analysis should include multiple perspectives, detailed examples, 
                     historical context, current trends, and future implications.`,
        output: "A comprehensive research report with in-depth analysis, detailed citations, expert opinions, data-backed insights, and thorough examination of all aspects of the topic",
        agents: {
            searchAgent,
            crawlerAgent,
            analyzerAgent,
            writerAgent
        },
        maxIterations: 20 
    });
};

(async function main() {
    const query = "Brief me about Pectra upgrade for ethereum";
    const workflow = createDeepResearchWorkflow(query);
    
    const initialState = {
        agent: "searchAgent",
        status: "running",
        messages: [
            user(`Conduct a thorough investigation on: ${query}. 
                  Please include:
                  1. Detailed background information
                  2. Historical context and development
                  3. Key achievements and milestones
                  4. Impact and influence
                  5. Critical analysis and expert opinions
                  6. Future implications and trends
                  7. Comparative analysis with similar topics
                  8. Relevant statistics and data
                  9. Multiple perspectives and viewpoints
                  10. Comprehensive citations and sources`)
        ],
        children: []
    } as ZeeWorkflowState;

    const result = await ZeeWorkflow.run(workflow, initialState);
    console.log("Research Results:", result);
})();