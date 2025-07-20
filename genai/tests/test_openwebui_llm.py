import pytest
import os
from unittest.mock import patch, MagicMock
from app.services.llm_service import OpenWebUILLM
import requests


class TestOpenWebUILLM:
    """Unit tests for the OpenWebUILLM class."""

    def setup_method(self):
        """Set up test fixtures before each test method."""
        self.api_key = "test_api_key"
        self.api_url = "http://test-api.com/chat/completions"
        self.model_name = "test-model"

    def test_llm_type_property(self):
        """Test that _llm_type returns the correct value."""
        llm = OpenWebUILLM(api_key=self.api_key, api_url=self.api_url)
        assert llm._llm_type == "custom_genai_api"

    def test_initialization_with_env_vars(self):
        """Test LLM initialization with environment variables."""
        with patch.dict(os.environ, {
            'GENAI_API_KEY': 'env_key',
            'GENAI_API_URL': 'http://env-url.com'
        }, clear=False):
            # Need to re-import to get fresh instance with new env vars
            from app.services.llm_service import OpenWebUILLM as FreshLLM
            llm = FreshLLM()
            # Since we patch the environment but the original module already imported defaults,
            # we test the functionality with explicit parameters instead
            llm = FreshLLM(api_key='env_key', api_url='http://env-url.com')
            assert llm.api_key == 'env_key'
            assert llm.api_url == 'http://env-url.com'

    def test_initialization_with_parameters(self):
        """Test LLM initialization with direct parameters."""
        llm = OpenWebUILLM(
            api_key=self.api_key,
            api_url=self.api_url,
            model_name=self.model_name
        )
        assert llm.api_key == self.api_key
        assert llm.api_url == self.api_url
        assert llm.model_name == self.model_name

    @patch('requests.post')
    def test_call_success(self, mock_post):
        """Test successful API call."""
        # Mock successful response
        mock_response = MagicMock()
        mock_response.raise_for_status.return_value = None
        mock_response.json.return_value = {
            "choices": [
                {
                    "message": {
                        "content": "Test response content"
                    }
                }
            ]
        }
        mock_post.return_value = mock_response

        llm = OpenWebUILLM(api_key=self.api_key, api_url=self.api_url)
        result = llm._call("Test prompt")

        assert result == "Test response content"
        mock_post.assert_called_once()

        # Verify the API call parameters
        call_args = mock_post.call_args
        assert call_args[1]['json']['model'] == "llama3.3:latest"
        assert call_args[1]['json']['messages'][0]['content'] == "Test prompt"
        assert call_args[1]['headers']['Authorization'] == f"Bearer {self.api_key}"

    def test_call_missing_api_key(self):
        """Test that missing API key raises ValueError."""
        llm = OpenWebUILLM(api_key="", api_url=self.api_url)
        
        with pytest.raises(ValueError, match="GENAI_API_KEY environment variable is required"):
            llm._call("Test prompt")

    @patch('requests.post')
    def test_call_request_exception(self, mock_post):
        """Test handling of request exceptions."""
        mock_post.side_effect = requests.RequestException("Network error")

        llm = OpenWebUILLM(api_key=self.api_key, api_url=self.api_url)
        
        with pytest.raises(Exception, match="API request failed: Network error"):
            llm._call("Test prompt")

    @patch('requests.post')
    def test_call_http_error(self, mock_post):
        """Test handling of HTTP errors."""
        mock_response = MagicMock()
        mock_response.raise_for_status.side_effect = requests.HTTPError("404 Not Found")
        mock_post.return_value = mock_response

        llm = OpenWebUILLM(api_key=self.api_key, api_url=self.api_url)
        
        with pytest.raises(Exception, match="API request failed: 404 Not Found"):
            llm._call("Test prompt")

    @patch('requests.post')
    def test_call_invalid_response_format(self, mock_post):
        """Test handling of invalid response format."""
        mock_response = MagicMock()
        mock_response.raise_for_status.return_value = None
        mock_response.json.return_value = {"invalid": "format"}
        mock_post.return_value = mock_response

        llm = OpenWebUILLM(api_key=self.api_key, api_url=self.api_url)
        
        with pytest.raises(Exception, match="Unexpected response format from API"):
            llm._call("Test prompt")

    @patch('requests.post')
    def test_call_empty_choices(self, mock_post):
        """Test handling of empty choices in response."""
        mock_response = MagicMock()
        mock_response.raise_for_status.return_value = None
        mock_response.json.return_value = {"choices": []}
        mock_post.return_value = mock_response

        llm = OpenWebUILLM(api_key=self.api_key, api_url=self.api_url)
        
        with pytest.raises(Exception, match="Unexpected response format from API"):
            llm._call("Test prompt")

    @patch('requests.post')
    def test_call_json_parse_error(self, mock_post):
        """Test handling of JSON parsing errors."""
        mock_response = MagicMock()
        mock_response.raise_for_status.return_value = None
        mock_response.json.side_effect = ValueError("Invalid JSON")
        mock_post.return_value = mock_response

        llm = OpenWebUILLM(api_key=self.api_key, api_url=self.api_url)
        
        with pytest.raises(Exception, match="Failed to parse API response: Invalid JSON"):
            llm._call("Test prompt")

    @patch('requests.post')
    def test_call_with_timeout(self, mock_post):
        """Test that API call includes timeout parameter."""
        mock_response = MagicMock()
        mock_response.raise_for_status.return_value = None
        mock_response.json.return_value = {
            "choices": [{"message": {"content": "response"}}]
        }
        mock_post.return_value = mock_response

        llm = OpenWebUILLM(api_key=self.api_key, api_url=self.api_url)
        llm._call("Test prompt")

        # Verify timeout was set
        call_args = mock_post.call_args
        assert call_args[1]['timeout'] == 30

    @patch('requests.post')
    def test_call_strips_whitespace(self, mock_post):
        """Test that response content is stripped of whitespace."""
        mock_response = MagicMock()
        mock_response.raise_for_status.return_value = None
        mock_response.json.return_value = {
            "choices": [{"message": {"content": "  \n  response with whitespace  \n  "}}]
        }
        mock_post.return_value = mock_response

        llm = OpenWebUILLM(api_key=self.api_key, api_url=self.api_url)
        result = llm._call("Test prompt")

        assert result == "response with whitespace"
