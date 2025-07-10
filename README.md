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
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
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
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
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
* [![JQuery][JQuery.com]][JQuery-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple example steps.

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

  We use Clerk for user athentication and session management. Create a Clerk account on the [official website](https://clerk.com/).



### Installation

1. Setup a static domain for ngrok by following the [official insturctions](https://ngrok.com/blog-post/free-static-domains-ngrok-users).
   
   Then, run
   ```sh
   ngrok http 8085 --url=<YOUR_STATIC_DOMAIN>
   ```
   This exposes port 8085 (thus the API gateway) to the internet.
2. Create ```.env``` files in both ```/server``` and ```/client``` by copying the ```.env.example``` files.
3. Setup Clerk webhook

   In order to sync users from Clerk to the local user DB, Clerk needs a way to communicate with the application. This is done through webhooks - every time a new user registers using Clerk, Clerk sends a request to our application containing the user's detailed information.

   Sign in to your Clerk dashboard. Go to Configure -> Webhooks(under Developers). Click on "Add Endpoint". Under endpoint URL, enter ```<YOUR_STATIC_DOMAIN>/api/webhooks```. Below, subscribe to all ```user``` events: ```user.created```, ```user.deleted```, and ```user.updated```. Finally, click "Create".

   Click into the webhook endpoint you just created. On the right side of the page, there should be a field "Signing Secret" with a value that starts with ```whesc_...```. Copy that value and paste it into ```/server/.env```'s ```CLERK_WEBHOOK_SECRET``` variable.
4. Set up Clerk key pair
   
   Under Configure -> API keys (under Developers), select "React" in the top-right dropdown menu of "Quick Copy". Then, copy over the ```VITE_CLERK_PUBLISHABLE_KEY``` to ```client/.env```.

   Finally, on the same page, under "Secrete keys", add a new key and copy the value of the secret key over to ```/server/.env```'s ```CLERK_SECRET_KEY```.
5. Build and run using Docker
   In the root folder, run
   ```sh
   docker compose up --build
   ```
   Access the application through ```http://localhost:3000```.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

* Sign in. If you don't have an account yet, sign up first.
* Click on "My Journal" on the top right.
* Click on "Add Snippet". Select your current moode, write some short sentences about what's on your mind, and save it. 
* After you have written at least three snippets, click on "Create Journal". In the journal editor, you can:
  
  * Click on "Today's Journal" in the top bar to change the title of the journal.
  * Click on "Edit" or directly click the journal content to write your daily journal.
    * When in the editing view, you can click "Summarise" to let the LLM summarize your snippets. You can use the result as a starting point.
  * Don't forget to save your changes!
  * If you have used the summarization function, you can click "Insights" on the top right to view the analysis of your day based on your snippets.
* You can search for and view old journals in the tab "Previous Journals".
* In the "Overview" tab, you can see statistics of your journaling habit.
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
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com 