import os
import sys
import requests
from typing import Optional, List, Any
from langchain.llms.base import LLM
from langchain.callbacks.manager import CallbackManagerForLLMRun


class OpenWebUILLM(LLM):
    """
    Custom LangChain LLM wrapper for Open WebUI API.

    This class integrates the Open WebUI API with LangChain's LLM interface,
    allowing us to use the API in LangChain chains and pipelines.
    """

    api_url: str = os.getenv("GENAI_API_URL", "https://gpu.aet.cit.tum.de/api/chat/completions")
    api_key: str = os.getenv("GENAI_API_KEY", "")
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


def check_genai_api_health() -> str:
    """Check if the GenAI API is accessible"""
    api_key = os.getenv("GENAI_API_KEY")
    api_url = os.getenv("GENAI_API_URL", "https://gpu.aet.cit.tum.de/api/chat/completions")
    
    try:
        if not api_key or api_key == "dummy":
            return "DISABLED"
        
        # Make a simple request to check API availability
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        # Simple health check payload - using the same model as configured
        test_payload = {
            "model": "llama3.3:latest",  # Use the same model as your service
            "messages": [{"role": "user", "content": "test"}],
            "max_tokens": 1
        }
        
        response = requests.post(
            api_url,
            json=test_payload,
            headers=headers,
            timeout=10  # Increased timeout for more reliable checks
        )
        
        # Check for successful response codes
        if response.status_code == 200:
            return "UP"
        elif response.status_code in [400, 401, 403]:
            # These might indicate API key or model issues but API is reachable
            print(f"GenAI API returned {response.status_code}: {response.text}")
            return "DEGRADED"
        else:
            print(f"GenAI API health check failed with status {response.status_code}")
            return "DOWN"
            
    except requests.exceptions.Timeout:
        print("GenAI API health check timed out")
        return "DOWN"
    except requests.exceptions.ConnectionError:
        print("GenAI API connection error")
        return "DOWN"
    except Exception as e:
        print(f"GenAI API health check error: {str(e)}")
        return "DOWN"


def get_system_info() -> dict:
    """Get system information for health checks"""
    api_key = os.getenv("GENAI_API_KEY")
    api_url = os.getenv("GENAI_API_URL", "https://gpu.aet.cit.tum.de/api/chat/completions")
    
    return {
        "genai_api_url": api_url,
        "has_api_key": bool(api_key and api_key != "dummy"),
        "api_key_prefix": api_key[:10] + "..." if api_key else "None",
        "model_name": "llama3.3:latest",
        "python_version": f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}"
    }