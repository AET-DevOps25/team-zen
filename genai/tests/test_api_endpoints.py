from fastapi.testclient import TestClient
from unittest.mock import patch
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
        data = response.json()
        
        # Check the new response format
        assert data["status"] == "UP"
        assert data["service"] == "genai-microservice"
        assert data["port"] == 8082
        assert data["version"] == "1.0.0"
        assert "timestamp" in data

    def test_detailed_health_check_endpoint(self):
        """Test detailed health check endpoint."""
        response = self.client.get("/api/genai/health/detailed")
        
        assert response.status_code == 200
        data = response.json()
        
        # Should have all basic health info plus additional details
        assert data["status"] == "UP"
        assert data["service"] == "genai-microservice"
        assert data["port"] == 8082
        assert data["version"] == "1.0.0"
        assert "timestamp" in data
        assert "configuration" in data
        assert "dependencies" in data

    def test_summarize_endpoint_empty_snippets(self):
        """Test summarization with empty snippets list."""
        empty_request = {"snippetContents": []}
        
        response = self.client.post("/api/genai/summary", json=empty_request)
        
        assert response.status_code == 400
        assert "snippetContents list cannot be empty" in response.json()["detail"]

    def test_insights_endpoint_empty_snippets(self):
        """Test insights with empty snippets list."""
        empty_request = {"snippetContents": []}
        
        response = self.client.post("/api/genai/insights", json=empty_request)
        
        assert response.status_code == 400
        assert "snippetContents list cannot be empty" in response.json()["detail"]

    def test_summarize_endpoint_invalid_request_format(self):
        """Test summarization with invalid request format."""
        invalid_request = {"snippetContents": "not a list"}
        
        response = self.client.post("/api/genai/summary", json=invalid_request)
        
        assert response.status_code == 422  # Validation error

    def test_insights_endpoint_invalid_request_format(self):
        """Test insights with invalid request format."""
        invalid_request = {"snippetContents": "not a list"}
        
        response = self.client.post("/api/genai/insights", json=invalid_request)
        
        assert response.status_code == 422  # Validation error
        
    def test_summarize_endpoint_missing_field(self):
        """Test summarization with missing required field."""
        invalid_request = {"wrongField": ["snippet1", "snippet2"]}
        
        response = self.client.post("/api/genai/summary", json=invalid_request)
        
        assert response.status_code == 422

    def test_insights_endpoint_missing_field(self):
        """Test insights with missing required field."""
        invalid_request = {"wrongField": ["snippet1", "snippet2"]}
        
        response = self.client.post("/api/genai/insights", json=invalid_request)
        
        assert response.status_code == 422

    def test_summarize_endpoint_content_type_validation(self):
        """Test that summary endpoint requires JSON content type."""
        response = self.client.post(
            "/api/genai/summary",
            data="not json",
            headers={"Content-Type": "text/plain"}
        )
        
        assert response.status_code == 422

    def test_insights_endpoint_content_type_validation(self):
        """Test that insights endpoint requires JSON content type."""
        response = self.client.post(
            "/api/genai/insights",
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
        
        response = self.client.post("/insights", json=self.sample_request)
        assert response.status_code == 404
        
        # Test that prefixed routes work
        response = self.client.get("/api/genai/health")
        assert response.status_code == 200

    @patch('app.services.summary_service.SummaryService.process_summary')
    def test_summary_endpoint_success(self, mock_process_summary):
        """Test the summary endpoint with mocked service."""
        # Mock the service response
        mock_process_summary.return_value = {
            "summary": "Test summary of the day's activities"
        }
        
        response = self.client.post("/api/genai/summary", json=self.sample_request)
        
        assert response.status_code == 200
        data = response.json()
        
        # Should only contain summary
        assert "summary" in data
        assert isinstance(data["summary"], str)
        assert len(data["summary"]) > 0
        assert data["summary"] == "Test summary of the day's activities"
        
        # Verify service was called with correct data
        mock_process_summary.assert_called_once()

    @patch('app.services.insights_service.InsightsService.process_insights')
    def test_insights_endpoint_success(self, mock_process_insights):
        """Test the insights endpoint with mocked service."""
        # Mock the service response
        mock_process_insights.return_value = {
            "analysis": "Test analysis of the journal entries",
            "insights": {
                "moodPattern": "positive",
                "suggestion": "Keep up the good work",
                "achievement": "Productive day completed",
                "wellnessTip": "Maintain work-life balance"
            }
        }
        
        response = self.client.post("/api/genai/insights", json=self.sample_request)
        
        assert response.status_code == 200
        data = response.json()
        
        # Should contain analysis and insights
        assert "analysis" in data
        assert "insights" in data
        assert isinstance(data["analysis"], str)
        assert isinstance(data["insights"], dict)
        
        # Insights should have the expected structure
        insights = data["insights"]
        assert "moodPattern" in insights
        assert "suggestion" in insights
        assert "achievement" in insights
        assert "wellnessTip" in insights
        
        # Verify service was called with correct data
        mock_process_insights.assert_called_once()
