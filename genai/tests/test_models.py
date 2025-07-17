import pytest
from pydantic import ValidationError
from app.models.schemas import SummaryRequest, InsightsResponse, SummaryResponse


class TestPydanticModels:
    """Unit tests for Pydantic models."""

    def test_summary_request_valid(self):
        """Test valid SummaryRequest creation."""
        request = SummaryRequest(snippetContents=["snippet1", "snippet2"])
        assert request.snippetContents == ["snippet1", "snippet2"]

    def test_summary_request_empty_list(self):
        """Test SummaryRequest with empty list."""
        request = SummaryRequest(snippetContents=[])
        assert request.snippetContents == []

    def test_summary_request_single_item(self):
        """Test SummaryRequest with single snippet."""
        request = SummaryRequest(snippetContents=["single snippet"])
        assert request.snippetContents == ["single snippet"]

    def test_summary_request_validation_error(self):
        """Test SummaryRequest validation with invalid data."""
        with pytest.raises(ValidationError):
            SummaryRequest(snippetContents="not a list")

    def test_insights_response_valid(self):
        """Test valid InsightsResponse creation."""
        insights = InsightsResponse(
            mood="Happy and energetic",
            suggestion="Take more breaks",
            achievement="Completed workout",
            wellness="Drink more water"
        )
        assert insights.mood == "Happy and energetic"
        assert insights.suggestion == "Take more breaks"
        assert insights.achievement == "Completed workout"
        assert insights.wellness == "Drink more water"

    def test_insights_response_empty_strings(self):
        """Test InsightsResponse with empty strings."""
        insights = InsightsResponse(
            mood="",
            suggestion="",
            achievement="",
            wellness=""
        )
        assert insights.mood == ""
        assert insights.suggestion == ""
        assert insights.achievement == ""
        assert insights.wellness == ""

    def test_insights_response_missing_fields(self):
        """Test InsightsResponse validation with missing fields."""
        with pytest.raises(ValidationError):
            InsightsResponse(mood="Happy", suggestion="Rest")
            # Missing achievement and wellness fields

    def test_summary_response_valid(self):
        """Test valid SummaryResponse creation."""
        insights = InsightsResponse(
            mood="Positive",
            suggestion="Exercise more",
            achievement="Finished project",
            wellness="Meditate daily"
        )
        
        response = SummaryResponse(
            summary="Today was productive",
            analysis="You showed great focus",
            insights=insights
        )
        
        assert response.summary == "Today was productive"
        assert response.analysis == "You showed great focus"
        assert response.insights.mood == "Positive"

    def test_summary_response_empty_strings(self):
        """Test SummaryResponse with empty strings."""
        insights = InsightsResponse(
            mood="",
            suggestion="",
            achievement="",
            wellness=""
        )
        
        response = SummaryResponse(
            summary="",
            analysis="",
            insights=insights
        )
        
        assert response.summary == ""
        assert response.analysis == ""

    def test_summary_response_validation_error(self):
        """Test SummaryResponse validation with invalid insights."""
        with pytest.raises(ValidationError):
            SummaryResponse(
                summary="Test summary",
                analysis="Test analysis",
                insights="not an InsightsResponse object"
            )

    def test_insights_response_serialization(self):
        """Test InsightsResponse serialization to dict."""
        insights = InsightsResponse(
            mood="Calm",
            suggestion="Read before bed",
            achievement="Early morning run",
            wellness="Practice gratitude"
        )
        
        expected_dict = {
            "mood": "Calm",
            "suggestion": "Read before bed",
            "achievement": "Early morning run",
            "wellness": "Practice gratitude"
        }
        
        assert insights.model_dump() == expected_dict

    def test_summary_response_serialization(self):
        """Test SummaryResponse serialization to dict."""
        insights = InsightsResponse(
            mood="Energetic",
            suggestion="Stay hydrated",
            achievement="Completed all tasks",
            wellness="Take walking breaks"
        )
        
        response = SummaryResponse(
            summary="Productive day with good energy",
            analysis="You maintained consistent focus throughout the day",
            insights=insights
        )
        
        result_dict = response.model_dump()
        
        assert result_dict["summary"] == "Productive day with good energy"
        assert result_dict["analysis"] == "You maintained consistent focus throughout the day"
        assert result_dict["insights"]["mood"] == "Energetic"
        assert result_dict["insights"]["suggestion"] == "Stay hydrated"
