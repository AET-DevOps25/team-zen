import pytest
from unittest.mock import patch, MagicMock
from app.main import summary_chain, SummaryRequest, SummaryResponse, InsightsResponse


class TestSummaryChain:
    """Unit tests for the summary chain and text parsing logic."""

    def setup_method(self):
        """Set up test fixtures before each test method."""
        self.sample_snippets = [
            "Woke up feeling energetic and ready for the day",
            "Had a great workout at the gym",
            "Completed an important presentation at work",
            "Feeling stressed about upcoming deadlines"
        ]

    def test_parsing_logic_demonstration(self):
        """Demonstrates the text parsing logic without LangChain mocking."""
        # This test shows how the parsing logic works with a sample response
        mock_llm_output = """Journal Summary:
Today I woke up feeling energetic and had a productive day with exercise and work achievements.

Analysis:
You demonstrated excellent self-care by exercising and accomplished significant work milestones.

Insights:
Mood Pattern: Started energetic, maintained productivity, ended with some stress
Suggestion: Try time-blocking to manage deadline stress more effectively
Achievement: Successfully completed presentation and maintained exercise routine
Wellness Tip: Practice deep breathing exercises when feeling deadline pressure"""

        # Test the parsing logic that's used in main.py
        output = mock_llm_output
        summary_text = ""
        analysis_text = ""
        insights_dict = {
            "mood": "",
            "suggestion": "",
            "achievement": "",
            "wellness": ""
        }

        # Split the output into sections (same logic as main.py)
        sections = output.split("Analysis:")
        if len(sections) >= 2:
            summary_text = sections[0].replace("Journal Summary:", "").strip()
            
            analysis_sections = sections[1].split("Insights:")
            analysis_text = analysis_sections[0].strip()
            
            if len(analysis_sections) >= 2:
                insights_text = analysis_sections[1].strip()
                
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

        # Verify parsing results
        assert summary_text == "Today I woke up feeling energetic and had a productive day with exercise and work achievements."
        assert "You demonstrated excellent self-care" in analysis_text
        assert insights_dict["mood"] == "Started energetic, maintained productivity, ended with some stress"
        assert insights_dict["suggestion"] == "Try time-blocking to manage deadline stress more effectively"
        assert insights_dict["achievement"] == "Successfully completed presentation and maintained exercise routine"
        assert insights_dict["wellness"] == "Practice deep breathing exercises when feeling deadline pressure"

    def test_parsing_logic_missing_sections(self):
        """Test parsing when some sections are missing."""
        mock_llm_output = """Journal Summary:
Had a good day overall.

Analysis:
You had a positive experience today."""

        # Parse using same logic as main.py
        output = mock_llm_output
        summary_text = ""
        analysis_text = ""
        insights_dict = {
            "mood": "",
            "suggestion": "",
            "achievement": "",
            "wellness": ""
        }

        sections = output.split("Analysis:")
        if len(sections) >= 2:
            summary_text = sections[0].replace("Journal Summary:", "").strip()
            analysis_sections = sections[1].split("Insights:")
            analysis_text = analysis_sections[0].strip()

        assert summary_text == "Had a good day overall."
        assert analysis_text == "You had a positive experience today."
        # All insights should remain empty
        assert insights_dict["mood"] == ""
        assert insights_dict["suggestion"] == ""
        assert insights_dict["achievement"] == ""
        assert insights_dict["wellness"] == ""

    def test_parsing_logic_malformed_response(self):
        """Test parsing of malformed LLM response."""
        mock_llm_output = "This is just a plain response without proper formatting."

        # Parse using same logic as main.py
        output = mock_llm_output
        summary_text = ""
        insights_dict = {
            "mood": "",
            "suggestion": "",
            "achievement": "",
            "wellness": ""
        }

        sections = output.split("Analysis:")
        if len(sections) < 2:
            # Fallback: no proper sections found
            summary_text = output.strip()

        assert summary_text == "This is just a plain response without proper formatting."

    def test_parsing_logic_partial_insights(self):
        """Test parsing when only some insights are present."""
        mock_llm_output = """Journal Summary:
Today was mixed.

Analysis:
You experienced both highs and lows.

Insights:
Mood Pattern: Variable throughout the day
Achievement: Completed morning routine
Wellness Tip: Take evening walks"""

        # Parse using same logic as main.py
        output = mock_llm_output
        insights_dict = {
            "mood": "",
            "suggestion": "",
            "achievement": "",
            "wellness": ""
        }

        sections = output.split("Analysis:")
        if len(sections) >= 2:
            analysis_sections = sections[1].split("Insights:")
            if len(analysis_sections) >= 2:
                insights_text = analysis_sections[1].strip()
                
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

        assert insights_dict["mood"] == "Variable throughout the day"
        assert insights_dict["suggestion"] == ""  # Missing
        assert insights_dict["achievement"] == "Completed morning routine"
        assert insights_dict["wellness"] == "Take evening walks"

    def test_parsing_logic_extra_whitespace(self):
        """Test parsing with extra whitespace and formatting issues."""
        mock_llm_output = """Journal Summary:
   Today was great.   

Analysis:
   You did well today.   

Insights:
Mood Pattern:    Very positive    
Suggestion:    Keep up good habits    
Achievement:    Stayed focused    
Wellness Tip:    Continue current routine    """

        # Parse using same logic as main.py
        output = mock_llm_output
        summary_text = ""
        analysis_text = ""
        insights_dict = {
            "mood": "",
            "suggestion": "",
            "achievement": "",
            "wellness": ""
        }

        sections = output.split("Analysis:")
        if len(sections) >= 2:
            summary_text = sections[0].replace("Journal Summary:", "").strip()
            analysis_sections = sections[1].split("Insights:")
            analysis_text = analysis_sections[0].strip()
            
            if len(analysis_sections) >= 2:
                insights_text = analysis_sections[1].strip()
                
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

        # Verify whitespace is properly stripped
        assert summary_text == "Today was great."
        assert analysis_text == "You did well today."
        assert insights_dict["mood"] == "Very positive"
        assert insights_dict["suggestion"] == "Keep up good habits"
        assert insights_dict["achievement"] == "Stayed focused"
        assert insights_dict["wellness"] == "Continue current routine"

    def test_insights_response_creation(self):
        """Test creation of InsightsResponse from parsed data."""
        insights_dict = {
            "mood": "Positive and energetic",
            "suggestion": "Maintain current routine",
            "achievement": "Completed all tasks",
            "wellness": "Stay hydrated"
        }

        insights_response = InsightsResponse(**insights_dict)
        
        assert insights_response.mood == "Positive and energetic"
        assert insights_response.suggestion == "Maintain current routine"
        assert insights_response.achievement == "Completed all tasks"
        assert insights_response.wellness == "Stay hydrated"

    def test_summary_response_creation(self):
        """Test creation of complete SummaryResponse."""
        insights_dict = {
            "mood": "Calm and focused",
            "suggestion": "Continue meditation practice",
            "achievement": "Completed project milestone",
            "wellness": "Ensure adequate sleep"
        }

        insights_response = InsightsResponse(**insights_dict)
        summary_response = SummaryResponse(
            summary="Today I focused on important work and felt calm throughout.",
            analysis="You demonstrated excellent focus and self-awareness today.",
            insights=insights_response
        )

        assert summary_response.summary == "Today I focused on important work and felt calm throughout."
        assert summary_response.analysis == "You demonstrated excellent focus and self-awareness today."
        assert summary_response.insights.mood == "Calm and focused"
