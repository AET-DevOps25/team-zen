import traceback
from fastapi import HTTPException
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from app.models.schemas import SummaryRequest, SummaryResponse, InsightsResponse
from app.services.llm_service import OpenWebUILLM


class SummaryService:
    """Service for handling summarization operations"""
    
    def __init__(self):
        # Initialize the LLM
        self.llm = OpenWebUILLM()
        
        # Create the prompt template
        self.summary_prompt = PromptTemplate(
            input_variables=["input_text"],
            template="""
You are a thoughtful journal assistant.

Given the following snippets a user has recorded throughout their day:

{input_text}

Please provide a comprehensive analysis with three sections:

1. Write a concise and reflective Journal Summary as if the user wrote it themselves, using first-person language ("I", "my"). Use **only** the information in the snippets—do not add any thoughts, feelings, or actions not described.

2. Write an Analysis section **addressed directly to the user**, using "you" and "your" (instead of "the user"). Provide insights about the emotions you might have felt based on the snippets, and suggest possible recommendations for how you could feel happier or improve your wellbeing.

3. Provide specific Insights in the following four categories:
   - Mood Pattern: Analyze the emotional patterns throughout the day
   - Suggestion: Provide one actionable recommendation for improvement
   - Achievement: Identify one positive accomplishment or strength shown
   - Wellness Tip: Give one specific wellness or self-care recommendation

Format your response exactly as:

Journal Summary:
<summary here>

Analysis:
<analysis and recommendations here>

Insights:
Mood Pattern: <mood pattern analysis>
Suggestion: <actionable suggestion>
Achievement: <positive accomplishment>
Wellness Tip: <wellness recommendation>
"""
        )
        self.summary_chain = LLMChain(llm=self.llm, prompt=self.summary_prompt)
    
    def process_summary(self, request: SummaryRequest) -> SummaryResponse:
        """Process summary request and return structured response"""
        if not request.snippetContents:
            raise HTTPException(status_code=400, detail="snippetContents list cannot be empty.")

        try:
            combined = "\n\n".join(request.snippetContents)
            output = self.summary_chain.run(combined)

            # Initialize default values
            summary_text = ""
            analysis_text = ""
            insights_dict = {
                "mood": "",
                "suggestion": "",
                "achievement": "",
                "wellness": ""
            }

            # Split the output into sections
            sections = output.split("Analysis:")
            if len(sections) >= 2:
                # Extract summary
                summary_text = sections[0].replace("Journal Summary:", "").strip()
                
                # Split analysis and insights
                analysis_sections = sections[1].split("Insights:")
                analysis_text = analysis_sections[0].strip()
                
                # Parse insights if available
                if len(analysis_sections) >= 2:
                    insights_text = analysis_sections[1].strip()
                    
                    # Parse each insight category
                    for line in insights_text.split('\n'):
                        line = line.strip()
                        if line.startswith("Mood Pattern:"):
                            insights_dict["mood"] = line.replace("Mood Pattern:", "").strip()
                        elif line.startswith("Suggestion:"):
                            insights_dict["suggestion"] = line.replace("Suggestion:", "").strip()
                        elif line.startswith("Achievement:"):
                            insights_dict["achievement"] = line.replace("Achievement:", "").strip()
                        elif line.startswith("Wellness Tip:"):
                            insights_dict["wellness"] = line.replace("Wellness Tip:", "").strip()
            else:
                # Fallback: no proper sections found
                summary_text = output.strip()

            insights_response = InsightsResponse(**insights_dict)
            return SummaryResponse(
                summary=summary_text, 
                analysis=analysis_text, 
                insights=insights_response
            )
        except Exception as e:
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=f"Summarization failed: {str(e)}")