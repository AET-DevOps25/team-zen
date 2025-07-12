#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== GenAI Service Test Suite ===${NC}"
echo

# Check if we're in the right directory
if [ ! -f "app/main.py" ]; then
    echo -e "${RED}Error: Please run this script from the genai directory${NC}"
    exit 1
fi

# Install test dependencies if they don't exist
echo -e "${YELLOW}Installing test dependencies...${NC}"
if [ -f "test_requirements.txt" ]; then
    pip install -r test_requirements.txt
else
    pip install pytest pytest-asyncio pytest-mock httpx pytest-cov responses
fi

echo -e "${GREEN}Dependencies installed.${NC}"
echo

# Run different test suites
echo -e "${BLUE}Running Unit Tests...${NC}"
python -m pytest tests/test_openwebui_llm.py tests/test_models.py tests/test_summary_chain.py -v --tb=short

echo
echo -e "${BLUE}Running API Integration Tests...${NC}"
python -m pytest tests/test_api_endpoints.py -v --tb=short

echo
echo -e "${BLUE}Running Full Integration Tests...${NC}"
python -m pytest tests/test_integration.py -v --tb=short

echo
echo -e "${BLUE}Running All Tests with Coverage...${NC}"
python -m pytest tests/ --cov=app --cov-report=html --cov-report=term-missing --cov-fail-under=80

echo
echo -e "${GREEN}Test suite completed!${NC}"
echo -e "${YELLOW}Coverage report available in htmlcov/index.html${NC}"
