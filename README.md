<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://zenai-team.student.k8s.aet.cit.tum.de/">
    <img src="./client/public/favicon.ico" alt="Logo" width="50" height="50">
  </a>

  <h3 align="center">ZenAI</h3>

  <p align="center">
    A DevOps project by team Zen
    <br />
    <br />
    <a href="https://zenai-team.student.k8s.aet.cit.tum.de/">View Demo</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
        <li><a href="#architecture-overview">Architecture Overview</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li>
      <a href="#usage">Usage</a>
      <ul>
        <li><a href="#prerequisites">Overall Usage</a></li>
        <li><a href="#installation">GenAI Usage</a></li>
      </ul>
    </li>
    <li><a href="#cicd-pipeline">CI/CD Pipeline</a></li>
    <li><a href="#monitoring">Monitoring</a></li>
    <li><a href="#aws-deployment">AWS Deployment</a></li>
    <li><a href="#api-specifications">API Specifications</a></li>
    <li><a href="#contributors">Contributors</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

Transform Your Mental Wellness with AI

Your personal AI-powered journal that helps you track, understand, and improve your mental wellbeing through personalized insights and guidance.
<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With


* [![React][React.js]][React-url]
* [![Vite][Vite.js]][Vite-url]
* [![Spring][Spring]][Spring-url]
* [![Python][Python]][Python-url]
* [![Clerk][Clerk.com]][Clerk-url]
* [![Langchain][Langchain.com]][Langchain-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>


### Architecture Overview

* Subsystem decomposition

   ![Subsystem decomposition](./docs/diagrams/Component%20diagram.png)
* Analysis object diagram

   ![Analysis object diagram](./docs/diagrams/Analysis%20object%20model.png)
* Use case diagram

   ![Use case diagram](./docs/diagrams/Use%20case%20diagram.png)



<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

* npm
  ```sh
  npm install npm@latest -g
  ```
* Docker

  Follow the [official instructions](https://docs.docker.com/engine/install/).
* ngrok
  ```sh
  brew install ngrok
  ```
  Or follow the official instructions for [installation](https://ngrok.com/downloads/mac-os) and [signup](https://dashboard.ngrok.com/signup).
* Clerk

  We use Clerk for user authentication and session management. Create a Clerk account on the [official website](https://clerk.com/).

  * *Note*: A test clerk account is set up for the course instructors. Visit Confluence or contact us for details.



### Installation

1. Setup a static domain for ngrok by following the [official instructions](https://ngrok.com/blog-post/free-static-domains-ngrok-users).
   
   Then, run
   ```sh
   ngrok http 8085 --url=<YOUR_STATIC_DOMAIN>
   ```
   This exposes port 8085 (thus the API gateway) to the internet.
2. Create a ```.env``` file in the root directory by copying the ```.env.example``` files.
3. Setup Clerk webhook

   In order to sync users from Clerk to the local user DB, Clerk needs a way to communicate with the application. This is done through webhooks - every time a new user registers using Clerk, Clerk sends a request to our application containing the user's detailed information.

   Sign in to your Clerk dashboard. Go to Configure -> Webhooks (under Developers). Click on "Add Endpoint". Under endpoint URL, enter ```https://<YOUR_STATIC_DOMAIN>/api/webhooks```. Below, subscribe to all ```user``` events: ```user.created```, ```user.deleted```, and ```user.updated```. Finally, click "Create".

   Click into the webhook endpoint you just created. On the right side of the page, there should be a field "Signing Secret" with a value that starts with ```whesc_...```. Copy that value and paste it into ```.env```'s ```CLERK_WEBHOOK_SECRET``` variable.
4. Set up Clerk key pair
   
   Under Configure -> API keys (under Developers), select "React" in the top-right dropdown menu of "Quick Copy". Then, copy over the ```VITE_CLERK_PUBLISHABLE_KEY``` to ```.env```.

   Finally, on the same page, under "Secret keys", add a new key and copy the value of the secret key over to ```.env```'s ```CLERK_SECRET_KEY```.
5. Build and run using Docker
   In the root folder, run
   ```sh
   docker compose up --build
   ```
   Access the application through ```http://localhost:3000```.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

### General Usage

* **Sign in / register** using the button in the top-right corner.
* Navigate to the journal page by clicking either **"My Journal"** next to your user avatar, or **"Start Your Journalling Now"** in the middle of the homepage.
* Click on **"Add Snippet"** or **"Quick Entry"** button to start writing snippets. Select your current mood, write some short sentences about what's on your mind, and save it. You can also optionally add tags to your snippets for searching later.
* After you have written at least three snippets, you will be prompted to **"Create Journal"**. In the journal editor, you can:
  
  * Click on **"Today's Journal"** in the top bar to change the title of the journal.
  * Click on **"Edit"** or directly **click the journal content** to write your daily journal.
    * Need inspiration? Click **"Regenerate Journal"** to let the Gen-AI summarize your snippets. You can use the result as a starting point.
  * Once you've written something, you can click on **"Generate Insights"** to let the Gen-AI analyze your journal entry - mood pattern, suggestions, tips and so on. View the comprehensive analysis of your day by clicking **"Insights"** on the top-right.
  * You can search for, filter, and view old journals in the tab **"Previous Journals"**.
* In the **"Overview"** tab, you can see statistics of your journaling habit as well as your well-being trends.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### GenAI Usage

ZenAI utilizes generative AI to provide value to the user by using carefully put-together prompts. The two concrete use cases are:

* **Summarization/Generation** of journal entry content. This is intended to give users inspiration and serve as a basis/draft journal entry that the users can modify and improve upon with their own words. It also lowers the mental hurdle of starting to write a journal.
* **Analysis** of well-being insights. This aims to provide users with materials generated based on their journal entries, shedding lights on their mood pattern, and providing helpful tips. It allows for a deeper introspective perspective on one's self.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CI/CD -->
## CI/CD Pipeline

ZenAI uses GitHub Actions for continuous integration and deployment for automated testing, building, and deployment workflows.

### Continuous Integration (CI)

The main CI workflow validates code quality (linting) and runs tests across all services with path-based triggering:

1. **Client Testing** (`ci.yml`)
   - Triggered only when client code changes
   - Node.js 22 setup and dependency installation  
   - ESLint code linting
   - Build verification with Vite

2. **Server Testing** (`ci.yml`)
   - Triggered only when server code changes
   - Java 21 setup with Gradle build system
   - Matrix strategy testing all microservices (API Gateway, Journal, User)
   - Unit tests execution via `./gradlew test`
   - Build verification

3. **GenAI Service Testing** (`ci.yml`)
   - Triggered only when GenAI service code changes
   - Python 3.11 environment setup
   - Dependency installation and Ruff linting
   - FastAPI server health checks
   - Background service testing

4. **Helm Chart Validation** (`ci-kubernetes.yaml`)
   - Triggered on changes to Helm charts
   - Kubernetes and Helm setup
   - Chart linting and template rendering tests
   - Validates Kubernetes deployment configurations

### Continuous Deployment (CD)

#### Docker Image Building (`build_docker.yml`)
- Triggers directly on main branch pushes (no need to wait for CI since tests already passed on the PR)
- Multi-architecture builds (linux/amd64, linux/arm64)
- Pushes images to GitHub Container Registry (ghcr.io)
- Services built: client, api-gateway, journal-microservice, user-microservice, genai

#### Kubernetes Deployment (`deploy_kubernetes.yaml`)
- Triggered after successful Docker image builds
- Deploys to AET Kubernetes cluster using Helm
- Updates all services with latest images
- Namespace: `zenai-team`

#### AWS EC2 Deployment (`deploy_aws.yml`)
- Manual EC2 deployment using GitHub Actions and Ansible
- Triggered manually via workflow_dispatch or on push to main/feat/aws-deployment branches
- SSH-based deployment to pre-provisioned EC2 instances
- Docker Compose orchestration with monitoring stack

#### Infrastructure Provisioning
- Terraform-based EC2 instance provisioning on AWS  
- Ansible configuration management
- Triggered on infrastructure code changes

### Workflow Triggers

- **Pull Requests**: Run CI tests for changed components only
- **Main Branch Push**: Full CI/CD pipeline with automatic deployment
- **Manual Dispatch**: AWS EC2 deployment and Terraform operations
- **Path-based Triggers**: Intelligent triggering - only affected services are tested and rebuilt
  - Client changes → Client CI only
  - Server changes → Server CI only  
  - GenAI changes → GenAI CI only
  - Helm changes → Kubernetes validation only

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MONITORING -->
## Monitoring

ZenAI includes comprehensive monitoring with Prometheus and Grafana to track request time, request latency and error rate.

### Docker Compose Monitoring

When running the application with Docker Compose, monitoring services are automatically started:

1. **Prometheus** - Available at `http://localhost:9090`
   - Collects metrics from all microservices (the microservices can be seen under Status -> Targets)
   - Provides a web interface to view metrics and create queries (under Graph queries like `sum(http_server_requests_seconds_count{job="api-gateway"})` can be executed)
   - Stores time-series data for historical analysis

2. **Grafana** - Available at `http://localhost:3001`
   - Credentials: username is `admin` / password - contact us via Artemis
   - Pre-configured dashboards (request count, request rate, request latency, max request latency and error rate) for all microservices:
     - API Gateway metrics 
     - Journal Microservice metrics
     - User Microservice metrics
     - GenAI Service metrics

### Kubernetes Monitoring

1. **Access Grafana Dashboard**:
   Access to Grafana can be found in our Rancher project: 
   `https://zenai-team.student.k8s.aet.cit.tum.de/grafana`
   Credentials: username is `admin` / password - contact us via Artemis 

2. **Access Prometheus**:
   ```sh
   kubectl port-forward -n zenai-team deploy/prometheus 9090:9090
   ```
   If the port is already allocated, try another one:
   ```sh
   kubectl port-forward -n zenai-team deploy/prometheus 9091:9090
   ```
   Then visit `http://localhost:9090` in your browser.
   The available targets can be found under Status -> Targets
   Under Graph queries like `sum(http_server_requests_seconds_count{job="api-gateway"})` can be executed.


3. **View Application Logs**:
   ```sh 
   # View logs from specific service
   kubectl logs -l app=zenai-api-gateway-selector -n zenai-team
   kubectl logs -l app=zenai-journal-selector -n zenai-team
   kubectl logs -l app=zenai-user-selector -n zenai-team
   kubectl logs -l app=zenai-genai-selector -n zenai-team
   ```

### Custom Dashboards

Grafana comes pre-configured with custom dashboards located in:
- `grafana/provisioning/dashboards/` (Docker setup)
- `helm/files/grafana/dashboards/` (Kubernetes setup)

You can import additional dashboards or modify existing ones through the Grafana web interface (Dashboards -> New Dashboard).

### Alerting

Prometheus is configured with alert rules for:
- Service unavailability
Alert rules can be seen in Prometheus web interface under Status -> Rules or under Alerts (firing means the service was down for at least 1 min)


<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- AWS DEPLOYMENT -->
## AWS Deployment

AWS EC2 deployment using GitHub Actions and Ansible for automated deployment is also supported. You can provision the infrastructure using either Terraform (automated) or manual setup.

### Prerequisites

1. **AWS Account** with appropriate permissions
2. **GitHub repository** with admin access to configure secrets
3. **Terraform** installed locally (for infrastructure provisioning)
4. **AWS CLI** configured with your credentials
   - Run `aws configure` to set up your AWS Access Key ID, Secret Access Key, and default region
   - For temporary credentials (like from AWS Academy or SSO), you may also need to set session tokens:
     ```bash
     aws configure set aws_session_token YOUR_SESSION_TOKEN
     ```
   - Verify your configuration with: `aws sts get-caller-identity`

### Automated Infrastructure with Terraform

#### Setup Terraform Backend (First-time setup only)

**Note**: This step is only needed if the S3 bucket for Terraform state doesn't exist yet.

1. **Check if bucket exists**:
   ```bash
   aws s3 ls s3://zenai-terraform-state-bucket
   ```

2. **If bucket doesn't exist**, run the setup script:
   ```bash
   cd infra/
   ./setup-terraform-backend.sh
   ```

3. **If bucket already exists**, skip this step and proceed to GitHub secrets configuration.

#### Configure GitHub Secrets for Terraform
Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

| Secret Name | Description |
|-------------|-------------|
| `AWS_ACCESS_KEY_ID` | AWS Access Key for Terraform |
| `AWS_SECRET_ACCESS_KEY` | AWS Secret Key for Terraform |
| `AWS_SSH_KEY_NAME` | Name of your AWS Key Pair |
| `EC2_SSH_PRIVATE_KEY` | Contents of your EC2 private key (.pem file) |

#### Deploy Infrastructure

**Prerequisites**: Ensure AWS CLI is configured (see Prerequisites section above).

Run Terraform locally:
```bash
cd infra/
terraform init
terraform plan
terraform apply
```

**Note**: Terraform will use your AWS CLI credentials. If you're using temporary credentials (session tokens), make sure they're still valid before running Terraform commands.

The Terraform configuration will create:
- VPC with public subnet
- Security groups (SSH, HTTP, application ports)
- EC2 instance (t3.medium with 30GB encrypted storage)
- Elastic IP address

#### Terraform Variables
You can customize the infrastructure by modifying `infra/terraform.tfvars`:
```hcl
region        = "us-east-1"
ami_id        = "ami-0c02fb55956c7d316"  # Ubuntu 20.04 LTS
instance_type = "t3.medium"
key_name      = "your-key-pair-name"
```

### Option 2: Manual EC2 Instance Setup

If you prefer manual setup, launch an EC2 instance with the following configuration:
- **AMI**: Ubuntu Server 20.04 LTS or later
- **Instance Type**: t3.medium or larger (recommended for Docker workloads)
- **Security Group**: Allow inbound traffic on:
  - Port 22 (SSH)
  - Port 3000 (Frontend)
  - Port 8085 (API Gateway) 
  - Port 3001 (Grafana)
  - Port 9090 (Prometheus)
- **Key Pair**: Create or use existing key pair for SSH access

### Application Deployment Configuration

Regardless of which infrastructure option you choose, configure these GitHub secrets for application deployment:

#### Required Secrets (Repository Settings → Secrets and variables → Actions → Secrets)

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `EC2_SSH_PRIVATE_KEY` | Contents of your EC2 private key (.pem file) | `-----BEGIN RSA PRIVATE KEY-----\n...` |
| `GENAI_API_KEY` | API key for GenAI service | `your-genai-api-key` |
| `GENAI_API_URL` | URL for GenAI service endpoint | `https://gpu.aet.cit.tum.de/api/chat/completions` |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key for frontend | `pk_test_...` |
| `CLERK_SECRET_KEY` | Clerk secret key for backend authentication | `sk_test_...` |
| `CLERK_WEBHOOK_SECRET` | Clerk webhook secret for user sync | `whsec_...` |
| `CLERK_AUTHORIZED_PARTY` | Clerk authorized party URL | `http://YOUR_EC2_IP:3000` |
| `MONGO_DB_URI_USER` | MongoDB connection URI for user database | `mongodb://user-db:27017/userdb` |
| `MONGO_DB_URI_JOURNAL` | MongoDB connection URI for journal database | `mongodb://journal-db:27017/journaldb` |
| `GRAFANA_PASSWORD` | Password for Grafana admin user | `secure-password` |

#### Required Variables (Repository Settings → Secrets and variables → Actions → Variables)

| Variable Name | Description | Example |
|---------------|-------------|---------|
| `EC2_PUBLIC_IP` | Public IP address of your EC2 instance | `54.123.45.67` |

#### How to Add Secrets:

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret with the exact name and value

**For EC2_SSH_PRIVATE_KEY:**
```bash
# Copy the entire contents of your .pem file
cat ~/.ssh/your-ec2-key.pem
```
Copy the output (including `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----`) and paste as the secret value.

#### How to Add Variables:

1. In the same Actions secrets page, click the **Variables** tab
2. Click **New repository variable**
3. Add `EC2_PUBLIC_IP` with your instance's public IP (for manual setup) or use the Terraform output

### Infrastructure Management

#### Using Terraform 
- **Local Commands**: Run `terraform init`, `terraform plan`, and `terraform apply` locally
- **State Management**: State is stored in S3 bucket for persistence
- **Outputs**: After `terraform apply`, you'll get the EC2 instance public IP - add this to your GitHub variables

#### Manual EC2 Setup
- Launch an EC2 instance manually through AWS Console
- Note down the public IP and add it to GitHub variables as `EC2_PUBLIC_IP`

### Deployment Methods

#### Option A: Manual Trigger
1. Go to **Actions** tab in your GitHub repository
2. Click **Deploy to EC2** workflow
3. Click **Run workflow**

#### Option B: Automatic Trigger
The deployment happens automatically when:
- You push to the main branch (Docker images get built first, then deployment follows)
- Or you can trigger it manually if needed

### Monitoring Deployment

1. Watch the GitHub Actions workflow execution
2. Check the workflow summary for deployment status and URLs
3. Access your application at the provided URLs

### Deployment Process

The `deploy_aws.yml` workflow performs these steps:

1. **Validation**: Verify all required secrets and variables are configured
   - Checks for missing EC2_SSH_PRIVATE_KEY, GENAI_API_KEY, CLERK keys, and GRAFANA_PASSWORD
   - Validates EC2_PUBLIC_IP variable is set
   - Fails early with clear error messages if any configuration is missing
2. **Setup**: Checkout code and configure SSH keys
3. **Test Connection**: Verify SSH access to EC2 instance
4. **Install Ansible**: Set up Ansible on the GitHub runner
5. **Deploy**: Run Ansible playbook to deploy the application
6. **Verify**: Test if services are responding
7. **Summary**: Provide deployment status and access URLs

### Security Notes

- Never commit private keys or secrets to the repository
- Regularly rotate your GitHub tokens and API keys
- Use least-privilege security groups for your EC2 instance
- Consider using AWS Systems Manager Session Manager instead of SSH for enhanced security

### AWS Application URLs

After successful deployment, your application will be available at:

- **Frontend**: `http://YOUR_EC2_IP:3000`
- **API Gateway**: `http://YOUR_EC2_IP:8085`
- **Grafana**: `http://YOUR_EC2_IP:3001` (admin/YOUR_GRAFANA_PASSWORD)
- **Prometheus**: `http://YOUR_EC2_IP:9090`

### Troubleshooting AWS Deployment

#### Configuration Validation Failures
If the deployment fails during the validation step:
- **Check GitHub Secrets**: Go to Repository Settings → Secrets and variables → Actions → Secrets
- **Verify Required Secrets**: Ensure all required secrets are configured with exact names:
  - `EC2_SSH_PRIVATE_KEY`, `GENAI_API_KEY`, `VITE_CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET`, `GRAFANA_PASSWORD`
- **Check Variables**: Go to Variables tab and verify `EC2_PUBLIC_IP` is set
- **Review Error Messages**: The workflow provides specific guidance on missing configuration items

#### SSH Connection Issues
- Verify EC2 security group allows SSH (port 22) from GitHub Actions IPs
- Check that the private key is correctly formatted in the secret
- Ensure the EC2 instance is running and accessible

#### Application Not Starting
- SSH into the instance and check Docker logs:
  ```bash
  ssh -i ~/.ssh/your-key.pem ubuntu@YOUR_EC2_IP
  cd /home/ubuntu/app
  docker compose logs
  ```

#### Missing Environment Variables
- Verify all required secrets are configured in GitHub
- Check that variable names match exactly (case-sensitive)
- The deployment workflow now validates configuration before attempting deployment

<p align="right">(<a href="#readme-top">back to top</a>)</p>
## API Specifications

ZenAI's APIs for every single microservice (user, journal, genai and api-gateway) are documented using Swagger, and are accessible by visiting

* Local: ```http://localhost:8085/api/swagger-ui.html``` 
* Deployed: ```https://zenai-team.student.k8s.aet.cit.tum.de/api/swagger-ui.html```

in your browser and select the microservice for which you would like to see the API documentation in the dropdown list in the top-right corner.
<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- Contributors -->
## Contributors

| Contributor      | Responsibilities                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------ |
| Natalia Milanova | Backend CRUD operations, AI summarization functionality, Kubernetes deployment, Monitoring |
| Evan Christopher | Client implementation and testing, CI pipelines, AWS EC2 deployment, Overall code refactoring across features|
| Zexin Gong       | API gateway and authentication, Backend service tests, Overall testing & Bug fixes, Documentation                 |


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://github.com/AET-DevOps25/team-zen/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-url]: https://github.com/othneildrew/Best-README-Template/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew
[product-screenshot]: images/screenshot.png
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vite.js]: https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=Vite&logoColor=white
[Vite-url]: https://vite.org/
[Spring]: https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white
[Spring-url]: https://spring.io/
[Python]: https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54
[Python-url]: https://python.org/
[Clerk.com]: https://img.shields.io/badge/-Clerk-6C47FF?style=flat&logo=clerk&logoColor=white
[Clerk-url]: https://clerk.com
[Langchain.com]: https://img.shields.io/badge/LangChain-ffffff?logo=langchain&logoColor=green
[Langchain-url]: https://langchain.com