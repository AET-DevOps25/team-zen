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

2. Authentication Service
    - **Technology**: Clerk

    - **Responsibilities**:

      - Handles user registration and authentication.

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

      - Handles CRUD-operations of snippets and composition into journal entries.

      - Supports filtering and viewing entries.

    - **Database**: MongoDB

5. AI Service
    - **Technology**: Python microservice using LangChain

    - **Responsibilities**:

      - Summarize snippets into a coherent journal entry.

      - Analyze emotional trends and suggest behavioral insights.

    - **Interaction**: Communicates with external LLMs (e.g., OpenAI API)

## Diagrams
### Use Case Diagram
The following diagram illustrates the primary use cases of the ZenAI application, detailing the interactions between the user and the ZenAI application.
![Use Case Diagram](./diagrams/Use%20case%20diagram.png)

### Component Diagram
The following component diagram shows the high-level architecture of the ZenAI application, including the main components and their interactions. 
![Top-Level Design](./diagrams/Component%20diagram.png)

### Class Diagram
Here we have the preliminary class diagram for the ZenAI application. With adaptability in mind, specifically for the AI agent abstraction, we use the strategy pattern to allow for easy switching between online and offline AI agents based on the requirements stated in the project requirements.
![Class Diagram](./diagrams/Analysis%20object%20model.png)