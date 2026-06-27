# 🚀 PushCode

<div align="center">

# PushCode

### **AI-Powered Cloud IDE • Secure Code Execution • Intelligent Coding Assistant**

<p align="center">

![Java](https://img.shields.io/badge/Java-21-orange?style=for-the-badge\&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.x-6DB33F?style=for-the-badge\&logo=springboot)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge\&logo=mongodb)
![Docker](https://img.shields.io/badge/Docker-Containers-2496ED?style=for-the-badge\&logo=docker)
![LangChain4j](https://img.shields.io/badge/LangChain4j-AI-blueviolet?style=for-the-badge)
![Groq](https://img.shields.io/badge/Groq-LLM-black?style=for-the-badge)

</p>

<p align="center">

![GitHub stars](https://img.shields.io/github/stars/USERNAME/PushCode?style=social)
![GitHub forks](https://img.shields.io/github/forks/USERNAME/PushCode?style=social)
![GitHub issues](https://img.shields.io/github/issues/USERNAME/PushCode)
![GitHub pull requests](https://img.shields.io/github/issues-pr/USERNAME/PushCode)
![License](https://img.shields.io/github/license/USERNAME/PushCode)
![Last Commit](https://img.shields.io/github/last-commit/USERNAME/PushCode)
![Build](https://img.shields.io/badge/Build-Passing-brightgreen)
![Version](https://img.shields.io/badge/version-v1.0-blue)

</p>

---

### 🌐 A modern cloud-based development platform powered by AI and secure containerized execution.

**Write • Execute • Debug • Learn • Deploy**

</div>

---

# ✨ Features

## 🤖 AI Coding Assistant

* AI-powered code generation
* Bug detection and fixing
* Code explanation
* Algorithm optimization
* Programming Q&A
* Refactoring suggestions
* Documentation generation

Powered using:

* LangChain4j
* Groq API
* GPT-OSS-120B

---

## 💻 Online Code Execution

Execute programs securely inside Docker containers.

Supported Languages

* Java
* Python
* C
* C++
* JavaScript

Features

* Interactive Input
* Standard Output
* Error Output
* Compilation Logs
* Runtime Limits
* Memory Isolation
* Secure Sandbox

---

## 🔐 Authentication

* JWT Authentication
* BCrypt Password Encryption
* Secure Login
* Registration
* Stateless Sessions
* Role-based Ready

---

## 🌐 API Gateway

Centralized request routing using Spring Cloud Gateway.

Responsibilities

* Authentication
* Authorization
* Load Balancing
* CORS
* Request Routing
* Rate Limiting (Future)

---

## 📡 Service Discovery

Netflix Eureka automatically registers every service.

Benefits

* Dynamic Discovery
* Fault Tolerance
* Scalability

---

# 🏗 System Architecture

```text
                                   +----------------------+
                                   |      Frontend        |
                                   | React / Next.js      |
                                   +----------+-----------+
                                              |
                                              |
                                    Spring Cloud Gateway
                                              |
        --------------------------------------------------------------------
        |                         |                           |
        |                         |                           |
        ▼                         ▼                           ▼

+----------------+      +---------------------+     +----------------------+
| Security        |      | AI Agent Service    |     | Execution Service    |
| Service         |      | LangChain4j         |     | Docker Sandbox       |
| JWT             |      | Groq API            |     | Multi Language       |
+----------------+      +---------------------+     +----------------------+
        |                         |                           |
        -------------------------------------------------------
                              |
                              ▼
                    MongoDB Atlas Database
                              |
                              ▼
                      Eureka Discovery Server
```

---

# 🧩 Microservices

```
PushCode

├── Gateway
├── Security Service
├── Agent Service
├── Execution Service
├── Eureka Server
└── Shared Libraries
```

---

# 📸 Screenshots

## Dashboard

```
📷 docs/images/dashboard.png
```

---

## Code Editor

```
📷 docs/images/editor.gif
```

---

## AI Assistant

```
📷 docs/images/assistant.gif
```

---

## Code Execution

```
📷 docs/images/execution.gif
```

---

## Docker Sandbox

```
📷 docs/images/docker.gif
```

---

# 📁 Project Structure

```
PushCode

├── gateway
│
├── security
│
├── execution
│
├── agentic
│
├── eureka
│
├── docs
│     ├── images
│     └── api
│
├── docker-compose.yml
│
└── README.md
```

---

# ⚙ Technology Stack

## Backend

* Java 21
* Spring Boot
* Spring Security
* Spring Cloud Gateway
* Spring Cloud Eureka
* Spring Data MongoDB

---

## AI

* LangChain4j
* Groq
* GPT-OSS-120B

---

## Database

* MongoDB Atlas

---

## DevOps

* Docker
* Docker Compose

---

## Tools

* Maven
* Git
* IntelliJ IDEA
* VS Code

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/USERNAME/PushCode.git

cd PushCode
```

---

## Start Eureka

```bash
cd eureka

mvn spring-boot:run
```

---

## Start Gateway

```bash
cd gateway

mvn spring-boot:run
```

---

## Start Security Service

```bash
cd security

mvn spring-boot:run
```

---

## Start AI Service

```bash
cd agentic

mvn spring-boot:run
```

---

## Start Execution Service

```bash
cd execution

mvn spring-boot:run
```

---

## Using Docker

```bash
docker compose up --build
```

---

# 📚 API Documentation

## Authentication

### Register

```
POST /api/auth/register
```

Request

```json
{
  "username":"john",
  "password":"password"
}
```

---

### Login

```
POST /api/auth/login
```

---

### Validate Token

```
GET /api/auth/validate
```

---

## AI

### Chat

```
POST /api/ai/chat
```

---

### Explain Code

```
POST /api/ai/explain
```

---

### Generate Code

```
POST /api/ai/generate
```

---

### Fix Code

```
POST /api/ai/debug
```

---

## Execution

### Execute Program

```
POST /api/execute
```

---

### Send Input

```
POST /api/execute/input
```

---

### Get Result

```
GET /api/execute/result/{id}
```

---

# 🔒 Security Features

* JWT Authentication
* Password Encryption
* Stateless Sessions
* Gateway Authorization
* Docker Isolation
* Resource Limits

---

# 🔄 Request Flow

```text
User

   │

   ▼

Gateway

   │

   ├────────► Security

   │

   ├────────► AI Service

   │

   └────────► Execution Service

                    │

                    ▼

            Docker Container

                    │

                    ▼

               Program Output
```

---

# 🛣 Roadmap

## Version 1.0

* ✅ JWT Authentication
* ✅ AI Chat
* ✅ Docker Execution
* ✅ API Gateway
* ✅ Eureka
* ✅ MongoDB

---

## Version 1.5

* ⏳ Monaco Editor
* ⏳ File Explorer
* ⏳ Themes
* ⏳ Saved Projects

---

## Version 2.0

* ⏳ Collaborative Coding
* ⏳ Live Cursor Sharing
* ⏳ Team Workspaces
* ⏳ Project Templates

---

## Version 3.0

* ⏳ AI Code Review
* ⏳ AI Unit Test Generator
* ⏳ AI Documentation Generator
* ⏳ AI Performance Analyzer

---

# 🤝 Contributing

We welcome contributions from the community.

## Steps

1. Fork the repository

2. Clone your fork

```bash
git clone https://github.com/your-username/PushCode.git
```

3. Create a branch

```bash
git checkout -b feature/my-feature
```

4. Commit

```bash
git commit -m "Added amazing feature"
```

5. Push

```bash
git push origin feature/my-feature
```

6. Create a Pull Request

---

# 📈 Future Ideas

* Mobile IDE
* VS Code Extension
* GitHub Integration
* One-click Deployment
* Kubernetes Support
* WebSocket Terminal
* AI Voice Assistant
* Plugin Marketplace
* Multi-user Pair Programming
* Custom Docker Images

---

# 👨‍💻 Author

## Pushpak M. Jaiswal

Computer Engineering Student

Interested in

* Artificial Intelligence
* Distributed Systems
* Cloud Computing
* Backend Engineering
* Developer Tools

---

# ⭐ Show your support

If you like this project,

⭐ Star the repository

🍴 Fork it

🛠 Contribute

📢 Share it

---

# 📜 License

Licensed under the MIT License.

---

<div align="center">

### 🚀 PushCode — Build. Execute. Learn. Innovate.

Made with ❤️ by **Pushpak M. Jaiswal**

</div>
