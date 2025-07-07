import os
import pytest
from unittest.mock import patch


@pytest.fixture
def mock_env_vars():
    """Fixture to provide mock environment variables for testing."""
    return {
        'GENAI_API_KEY': 'test_api_key_123',
        'GENAI_API_URL': 'http://test-api.example.com/chat/completions'
    }


@pytest.fixture
def sample_snippets():
    """Fixture providing sample snippet data for testing."""
    return [
        "Woke up feeling energetic and ready for the day",
        "Had a great workout session at the gym",
        "Completed an important presentation at work",
        "Enjoyed a healthy lunch with colleagues",
        "Finished the day feeling accomplished"
    ]


@pytest.fixture
def sample_llm_response():
    """Fixture providing a sample LLM response for testing."""
    return """Journal Summary:
Today I woke up feeling energetic and had a productive day with exercise, work accomplishments, and social connections.

Analysis:
You demonstrated excellent balance by prioritizing both physical health and professional responsibilities. Your energy management throughout the day was impressive.

Insights:
Mood Pattern: Started energetic, maintained momentum, ended accomplished
Suggestion: Continue balancing work, exercise, and social connections
Achievement: Successfully completed presentation while maintaining healthy habits
Wellness Tip: Keep prioritizing both physical activity and social interactions"""


@pytest.fixture
def mock_api_response():
    """Fixture providing a mock API response structure."""
    return {
        "choices": [
            {
                "message": {
                    "content": "Mock LLM response content"
                }
            }
        ]
    }


@pytest.fixture(autouse=True)
def reset_environment():
    """Automatically reset environment variables after each test."""
    original_env = os.environ.copy()
    yield
    os.environ.clear()
    os.environ.update(original_env)


@pytest.fixture
def mock_requests_post(monkeypatch):
    """Fixture to mock requests.post for testing."""
    import requests
    
    def mock_post(*args, **kwargs):
        from unittest.mock import MagicMock
        response = MagicMock()
        response.status_code = 200
        response.json.return_value = {
            "choices": [
                {
                    "message": {
                        "content": "Mocked LLM response"
                    }
                }
            ]
        }
        response.raise_for_status.return_value = None
        return response
    
    monkeypatch.setattr(requests, 'post', mock_post)
    return mock_post
