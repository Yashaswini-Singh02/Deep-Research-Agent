import { Agent } from "@covalenthq/ai-agent-sdk";
import { z } from "zod";
import { createTool } from "@covalenthq/ai-agent-sdk";

const CitationTool = createTool({
    id: "citation-tool",
    description: "Format citations in academic style (APA, MLA, Chicago)",
    schema: z.object({
        title: z.string().describe("Paper title"),
        authors: z.string().describe("Author names"),
        year: z.number().describe("Publication year"),
        journal: z.string().describe("Journal name"),
        style: z.enum(["APA", "MLA", "Chicago"]).default("APA")
    }),
    execute: async (params) => {
        const { title, authors, year, journal, style } = params as any;
        return `${authors} (${year}). ${title}. ${journal}.`;
    }
});

export const createWriterAgent = () => new Agent({
    name: "writer_agent",
    model: {
        provider: "OPEN_AI",
        name: "gpt-4o-mini",
    },
    description: "An agent specialized in writing comprehensive research reports and papers",
    instructions: [
        "Write clear and academically rigorous research reports",
        "Structure content logically with proper sections (intro, methods, results, discussion)",
        "Maintain consistent academic writing style and tone",
        "Include proper citations for all referenced works",
        "Synthesize complex information into clear explanations",
        "Balance technical detail with accessibility",
        "Highlight key findings and their implications",
        "Address potential counterarguments and limitations",
        "Create clear transitions between sections and ideas",
        "Conclude with practical implications and future research directions",
        "Use appropriate academic terminology",
        "Format citations according to specified style guide"
    ],
    tools: {
        citation: CitationTool
    }
});
