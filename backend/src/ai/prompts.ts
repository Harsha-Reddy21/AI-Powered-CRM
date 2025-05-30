export const PROMPTS = {
  DEAL_COACH: {
    SYSTEM: `You are an expert sales coach AI. Analyze sales deals and provide actionable insights to improve win probability. Your responses should be practical, data-driven, and focused on next steps.`,
    
    USER: (dealData: any) => `
Analyze this deal and provide coaching recommendations:

Deal Details:
- Name: ${dealData.title}
- Value: ${dealData.value}
- Stage: ${dealData.stage}
- Probability: ${dealData.probability}%
- Close Date: ${dealData.closeDate}
- Description: ${dealData.description}
- Contact: ${dealData.contact}
- Company: ${dealData.company}
- Days in current stage: ${dealData.daysInStage || 'Unknown'}

Recent Activities:
${dealData.activities?.map((activity: any) => `- ${activity.type}: ${activity.content}`).join('\n') || 'No recent activities'}

Please provide:
1. Risk Assessment (High/Medium/Low) with explanation
2. Top 3 recommended next actions
3. Potential roadblocks to watch for
4. Suggested timeline for next touchpoints
5. Key stakeholders to engage

Format your response as structured JSON with these fields: riskLevel, riskExplanation, nextActions, roadblocks, timeline, keyStakeholders.
`
  },

  PERSONA_BUILDER: {
    SYSTEM: `You are an expert customer persona analyst. Analyze all available customer data to build comprehensive buyer personas that help sales teams understand their prospects better.`,
    
    USER: (contactData: any) => `
Build a detailed customer persona based on this data:

Contact Information:
- Name: ${contactData.name}
- Role: ${contactData.role}
- Company: ${contactData.company}
- Email: ${contactData.email}

Communication History:
${contactData.activities?.map((activity: any) => `- ${activity.type}: ${activity.content}`).join('\n') || 'No communication history'}

Deal Context:
${contactData.deals?.map((deal: any) => `- ${deal.title}: ${deal.stage} (${deal.value})`).join('\n') || 'No associated deals'}

Notes:
${contactData.notes || 'No additional notes'}

Create a persona including:
1. Buyer Type (Decision Maker, Influencer, Champion, Gatekeeper)
2. Communication Style (Formal, Casual, Data-driven, Relationship-focused)
3. Key Motivators (Cost savings, Innovation, Efficiency, Growth, etc.)
4. Main Concerns/Objections likely to raise
5. Preferred Communication Channels
6. Decision-making timeline preference
7. Authority level and budget influence

Format as structured JSON with fields: buyerType, communicationStyle, motivators, concerns, preferredChannels, decisionTimeline, authorityLevel, summary.
`
  },

  OBJECTION_HANDLER: {
    SYSTEM: `You are an expert sales objection handler. Provide effective, empathetic responses to customer objections while addressing underlying concerns. Your responses should be professional, consultative, and focused on moving the conversation forward.`,
    
    USER: (objectionData: any) => `
Help handle this customer objection:

Customer Objection: "${objectionData.objectionText}"

Context:
- Deal: ${objectionData.dealTitle}
- Customer: ${objectionData.customerName}
- Role: ${objectionData.customerRole}
- Deal Stage: ${objectionData.stage}
- Deal Value: ${objectionData.value}

Customer Background:
${objectionData.background || 'No additional background provided'}

Provide:
1. Analysis of the underlying concern behind this objection
2. 3 different response approaches (Logical, Emotional, Social Proof)
3. Follow-up questions to better understand their concern
4. Supporting materials or case studies that might help
5. Next steps to move forward

Format as structured JSON with fields: analysis, responses (array of {approach, response}), followUpQuestions, supportingMaterials, nextSteps.
`
  },

  WIN_LOSS_ANALYSIS: {
    SYSTEM: `You are a sales performance analyst specializing in win-loss analysis. Analyze completed deals to identify patterns, success factors, and areas for improvement. Provide actionable insights for future deals.`,
    
    USER: (dealData: any) => `
Analyze this ${dealData.status} deal:

Deal Information:
- Name: ${dealData.title}
- Value: ${dealData.value}
- Final Stage: ${dealData.stage}
- Close Date: ${dealData.closeDate}
- Duration: ${dealData.duration} days
- Outcome: ${dealData.status}

Timeline:
${dealData.stageHistory?.map((stage: any) => `- ${stage.stageName}: ${stage.duration} days`).join('\n') || 'No stage timeline available'}

Activities:
${dealData.activities?.map((activity: any) => `- ${activity.type}: ${activity.content}`).join('\n') || 'No activities recorded'}

Competitors:
${dealData.competitors?.join(', ') || 'No competitors identified'}

Customer Feedback:
${dealData.feedback || 'No customer feedback available'}

Loss Reason (if applicable):
${dealData.lossReason || 'N/A'}

Provide analysis including:
1. Key success/failure factors
2. What went well vs. what could be improved
3. Timeline analysis (too fast/slow stages)
4. Competitive positioning effectiveness
5. Customer engagement quality
6. Lessons learned for similar future deals
7. Process improvement recommendations

Format as structured JSON with fields: outcome, keyFactors, timeline, competitive, engagement, lessonsLearned, recommendations, confidence.
`
  }
};

export type AIPromptType = keyof typeof PROMPTS; 