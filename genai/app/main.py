from fastapi import FastAPI, APIRouter, HTTPException
import os
from pydantic import BaseModel
from typing import List, Optional, Any
import requests
from langchain.llms.base import LLM     # Base class for custom LLMs
from langchain.chains import LLMChain   # Used to run prompt chain
from langchain.prompts import PromptTemplate  # For prompt creation
from langchain.callbacks.manager import CallbackManagerForLLMRun  # Used in _call
import traceback

router = APIRouter(prefix="/api/genai")

# Create a GENAI_API_KEY (Check here: https://artemis.tum.de/courses/446/lectures/1485)
GENAI_API_KEY = os.getenv("GENAI_API_KEY")
GENAI_API_URL = os.getenv("GENAI_API_URL", "https://gpu.aet.cit.tum.de/api/chat/completions")

class SummaryRequest(BaseModel):
    snippetContents: List[str]

class InsightsResponse(BaseModel):
    mood: str
    suggestion: str
    achievement: str
    wellness: str

class SummaryResponse(BaseModel):
    summary: str
    analysis: str
    insights: InsightsResponse

class OpenWebUILLM(LLM):
    """
    Custom LangChain LLM wrapper for Open WebUI API.

    This class integrates the Open WebUI API with LangChain's LLM interface,
    allowing us to use the API in LangChain chains and pipelines.
    """

    api_url: str = GENAI_API_URL or ""
    api_key: str = GENAI_API_KEY or ""
    model_name: str = "llama3.3:latest"

    @property
    def _llm_type(self) -> str:
        return "custom_genai_api"

    def _call(
        self,
        prompt: str,
        stop: Optional[List[str]] = None,
        run_manager: Optional[CallbackManagerForLLMRun] = None,
        **kwargs: Any,
    ) -> str:
        """
        Call the Open WebUI API to generate a response.

        Args:
            prompt: The input prompt to send to the model
            stop: Optional list of stop sequences
            run_manager: Optional callback manager for LangChain
            **kwargs: Additional keyword arguments

        Returns:
            The generated response text

        Raises:
            Exception: If API call fails
        """
        if not self.api_key:
            raise ValueError("GENAI_API_KEY environment variable is required")

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        # Build messages for chat completion
        messages = [
            {"role": "user", "content": prompt}
        ]

        payload = {
            "model": self.model_name,
            "messages": messages,
        }

        try:
            response = requests.post(
                self.api_url,
                headers=headers,
                json=payload,
                timeout=30
            )
            response.raise_for_status()

            result = response.json()

            # Extract the response content
            if "choices" in result and len(result["choices"]) > 0:
                content = result["choices"][0]["message"]["content"]
                return content.strip()
            else:
                raise ValueError("Unexpected response format from API")

        except requests.RequestException as e:
            raise Exception(f"API request failed: {str(e)}")
        except (KeyError, IndexError, ValueError) as e:
            raise Exception(f"Failed to parse API response: {str(e)}")


# Initialize the LLM
llm = OpenWebUILLM()

# Create the prompt template
summary_prompt = PromptTemplate(
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
summary_chain = LLMChain(llm=llm, prompt=summary_prompt)

@router.get("/health")
async def health_check():
    return {"status": "ok", "service": "GenAI Service"}

@router.post("/summary", response_model=SummaryResponse)
async def summarize(request: SummaryRequest):
    if not request.snippetContents:
        raise HTTPException(status_code=400, detail="snippetContents list cannot be empty.")

    try:
        combined = "\n\n".join(request.snippetContents)
        output = summary_chain.run(combined)

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


app = FastAPI()
app.include_router(router)

if __name__ == "__main__":
    """
    Entry point for `python main.py` invocation.
    Starts Uvicorn server serving this FastAPI app.

    Honors PORT environment variable (default: 8082).
    Reload=True enables live-reload during development.
    """
    import uvicorn

    port = int(os.getenv("PORT", 8082))

    print(f"Starting LLM Summarization Service on port {port}")
    print(f"API Documentation available at: http://localhost:{port}/docs")

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port
    )