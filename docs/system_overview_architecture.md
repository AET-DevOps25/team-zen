## Overview
ZenAI is designed as a microservices-based architecture with a clean separation between user interface, service layer, AI processing, and data storage. This setup enables scalability, modularity, and ease of maintenance.

## Client
- **Technology**: React

- **Description**:
The frontend is a responsive web application allowing users to:

  - Log journal snippets multiple times a day

  - View summaries and mood trends

- **Communication**:
Sends authenticated HTTP requests through the API Gateway to access microservices.

## Server-Side (Backend)
1. API Gateway
    - **Technology**: Spring Boot REST API

    - **Role**:
      - Central entry point for all client requests.

      - Routes requests to respective microservices.

      - Handles authentication via the Auth Service.

2. Authentication Server
    - **Technology**: Spring Boot REST API, Kinde

    - **Responsibilities**:

      - Handles user login/registration.

      - Issues tokens (e.g., JWT) for secure communication.

3. User Service
    - **Technology**: Spring Boot REST API

    - **Responsibilities**:

      - Manage user profiles.

      - Store and retrieve user data via the User Database.

    - **Database**: MongoDB

4. Journal Service
    - **Technology**: Spring Boot REST API

    - **Responsibilities**:

      - Handles CRUD-operations of snippets and composition into JournalEntry.

      - Supports filtering and viewing entries by date.

    - **Database**: MongoDB

5. AI Service
    - **Technology**: Python microservice using LangChain

    - **Responsibilities**:

      - Summarize snippets into a coherent journal entry.

      - Analyze emotional trends and suggest behavioral insights.

    - **Interaction**: Communicates with external LLMs (e.g., OpenAI API)

## AI Agent Abstraction
Context-Based AI-provider Selection:

- The AIContext selects the appropriate AI agent (online/offline) via Policy.

- Both OnlineAIAgent and OfflineAIAgent implement a shared interface for mood analysis and summarization.

LangChain Usage:

- Enables natural language understanding and summarization pipelines.