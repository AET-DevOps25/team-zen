import traceback
from fastapi import HTTPException
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from app.models.schemas import SummaryRequest
from app.services.llm_service import OpenWebUILLM


class SummaryService:
    """Service for handling summarization operations"""
    
    def __init__(self):
        # Initialize the LLM
        self.llm = OpenWebUILLM()
        
        # Create the prompt template for summary only
        self.summary_prompt = PromptTemplate(
            input_variables=["input_text"],
            template="""
You are a thoughtful journal assistant.

Given the following snippets a user has recorded throughout their day:

{input_text}

Please provide a concise and reflective Journal Summary as if the user wrote it themselves, using first-person language ("I", "my"). Use **only** the information in the snippets—do not add any thoughts, feelings, or actions not described.

Format your response exactly as:

Journal Summary:
<summary here>
"""
        )
        self.summary_chain = LLMChain(llm=self.llm, prompt=self.summary_prompt)
    
    def process_summary(self, request: SummaryRequest) -> dict:
        """Process summary request and return structured response"""
        if not request.snippetContents:
            raise HTTPException(status_code=400, detail="snippetContents list cannot be empty.")

        try:
            combined = "\n\n".join(request.snippetContents)
            output = self.summary_chain.run(combined)

            # Extract summary text
            summary_text = output.replace("Journal Summary:", "").strip()

            return {"summary": summary_text}
        except Exception as e:
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=f"Summarization failed: {str(e)}")