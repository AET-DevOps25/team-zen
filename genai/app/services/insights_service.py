import traceback
from fastapi import HTTPException
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from app.models.schemas import SummaryRequest
from app.services.llm_service import OpenWebUILLM


class InsightsService:
    """Service for handling insights generation operations"""
    
    def __init__(self):
        # Initialize the LLM
        self.llm = OpenWebUILLM()
        
        # Create the prompt template for insights
        self.insights_prompt = PromptTemplate(
            input_variables=["input_text"],
            template="""
You are a thoughtful journal assistant.

Given the following snippets a user has recorded throughout their day:

{input_text}

Please provide insights and analysis with two sections:

1. Write an Analysis section **addressed directly to the user**, using "you" and "your" (instead of "the user"). Provide insights about the emotions you might have felt based on the snippets, and suggest possible recommendations for how you could feel happier or improve your wellbeing.

2. Provide specific Insights in the following four categories:
   - Mood Pattern: Analyze the emotional patterns throughout the day
   - Suggestion: Provide one actionable recommendation for improvement
   - Achievement: Identify one positive accomplishment or strength shown
   - Wellness Tip: Give one specific wellness or self-care recommendation

Format your response exactly as:

Analysis:
<analysis and recommendations here>

Insights:
Mood Pattern: <mood pattern analysis>
Suggestion: <actionable suggestion>
Achievement: <positive accomplishment>
Wellness Tip: <wellness recommendation>
"""
        )
        self.insights_chain = LLMChain(llm=self.llm, prompt=self.insights_prompt)
    
    def process_insights(self, request: SummaryRequest) -> dict:
        """Process insights request and return structured response"""
        if not request.snippetContents:
            raise HTTPException(status_code=400, detail="snippetContents list cannot be empty.")

        try:
            combined = "\n\n".join(request.snippetContents)
            output = self.insights_chain.run(combined)

            # Initialize default values
            analysis_text = ""
            insights_dict = {
                "moodPattern": "",
                "suggestion": "",
                "achievement": "",
                "wellnessTip": ""
            }

            # Split the output into sections
            sections = output.split("Insights:")
            if len(sections) >= 2:
                # Extract analysis
                analysis_text = sections[0].replace("Analysis:", "").strip()
                
                # Parse insights if available
                insights_text = sections[1].strip()
                
                # Parse each insight category
                for line in insights_text.split('\n'):
                    line = line.strip()
                    if line.startswith("Mood Pattern:"):
                        insights_dict["moodPattern"] = line.replace("Mood Pattern:", "").strip()
                    elif line.startswith("Suggestion:"):
                        insights_dict["suggestion"] = line.replace("Suggestion:", "").strip()
                    elif line.startswith("Achievement:"):
                        insights_dict["achievement"] = line.replace("Achievement:", "").strip()
                    elif line.startswith("Wellness Tip:"):
                        insights_dict["wellnessTip"] = line.replace("Wellness Tip:", "").strip()
            else:
                # Fallback: no proper sections found
                analysis_text = output.strip()

            return {
                "analysis": analysis_text,
                "insights": insights_dict
            }
        except Exception as e:
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=f"Insights generation failed: {str(e)}")
