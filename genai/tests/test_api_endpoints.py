from fastapi.testclient import TestClient
from app.main import app


class TestAPIEndpoints:
    """Integration tests for API endpoints."""

    def setup_method(self):
        """Set up test client and fixtures."""
        self.client = TestClient(app)
        self.sample_request = {
            "snippetContents": [
                "Woke up feeling refreshed after 8 hours of sleep",
                "Had a productive morning workout",
                "Completed important project milestone at work",
                "Feeling a bit tired but satisfied with the day"
            ]
        }

    def test_health_check_endpoint(self):
        """Test health check endpoint."""
        response = self.client.get("/api/genai/health")
        
        assert response.status_code == 200
        assert response.json() == {"status": "ok", "service": "GenAI Service"}

    def test_summarize_endpoint_empty_snippets(self):
        """Test summarization with empty snippets list."""
        empty_request = {"snippetContents": []}
        
        response = self.client.post("/api/genai/summary", json=empty_request)
        
        assert response.status_code == 400
        assert "snippetContents list cannot be empty" in response.json()["detail"]

    def test_summarize_endpoint_invalid_request_format(self):
        """Test summarization with invalid request format."""
        invalid_request = {"snippetContents": "not a list"}
        
        response = self.client.post("/api/genai/summary", json=invalid_request)
        
        assert response.status_code == 422  # Validation error

    def test_summarize_endpoint_missing_field(self):
        """Test summarization with missing required field."""
        invalid_request = {"wrongField": ["snippet1", "snippet2"]}
        
        response = self.client.post("/api/genai/summary", json=invalid_request)
        
        assert response.status_code == 422

    def test_summarize_endpoint_content_type_validation(self):
        """Test that endpoint requires JSON content type."""
        response = self.client.post(
            "/api/genai/summary",
            data="not json",
            headers={"Content-Type": "text/plain"}
        )
        
        assert response.status_code == 422

    def test_api_prefix_routing(self):
        """Test that API routes are properly prefixed."""
        # Test that routes without prefix don't work
        response = self.client.get("/health")
        assert response.status_code == 404
        
        response = self.client.post("/summary", json=self.sample_request)
        assert response.status_code == 404
        
        # Test that prefixed routes work
        response = self.client.get("/api/genai/health")
        assert response.status_code == 200
