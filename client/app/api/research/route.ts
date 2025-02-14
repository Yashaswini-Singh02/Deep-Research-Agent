import { createDeepResearchWorkflow } from "@/utils";
import { ZeeWorkflow } from "@covalenthq/ai-agent-sdk";
import { ZeeWorkflowState } from "@covalenthq/ai-agent-sdk/dist/core/state";
import { user } from "@covalenthq/ai-agent-sdk/dist/core/base";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
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
              10. Comprehensive citations and sources`),
      ],
      children: [],
    } as ZeeWorkflowState;

    const result = await ZeeWorkflow.run(workflow, initialState);

    return NextResponse.json({
      messages: result.messages
        .map((message) => message.content)
        .filter((content): content is string => typeof content === "string"),
    });
  } catch (error) {
    console.error("Research failed:", error);
    return NextResponse.json(
      { error: "Research failed. Please try again." },
      { status: 500 }
    );
  }
}
