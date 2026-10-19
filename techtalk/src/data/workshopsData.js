/* ══════════════════════════════════════════════════════════════════
   NEXZIBYTE TECHTALK — TECHNOLOGY COURSES & HANDS-ON WORKSHOPS
   Curated catalog covering AI/ML, Full-Stack Web, Cloud & DevOps,
   Python Systems, Cybersecurity, Big Data & Analytics, Java & Mobile.
   ══════════════════════════════════════════════════════════════════ */

export const WORKSHOP_CATEGORIES = [
  { id: "all", label: "All Courses" },
  { id: "ai-ml", label: "AI & Machine Learning" },
  { id: "web-dev", label: "Web & Full-Stack" },
  { id: "cloud-devops", label: "Cloud & DevOps" },
  { id: "python-backend", label: "Python & Systems" },
  { id: "cybersecurity", label: "Cybersecurity" },
  { id: "data-analytics", label: "Data & Big Data" },
  { id: "mobile-dev", label: "Mobile Engineering" },
  { id: "java-spring", label: "Java & Microservices" }
];

export const TECHNICAL_WORKSHOPS = [
  {
    id: "ws-genai-rag-agents",
    categoryGroup: "ai-ml",
    track: "AI & MACHINE LEARNING",
    badge: "Masterclass",
    title: "Generative AI & Agentic RAG Systems Masterclass",
    duration: "6 Hours Hands-On Intensive",
    mode: "Live Interactive Lab (Online)",
    location: "Online / Virtual Sandbox",
    venue: "NexziByte Virtual AI Studio & Cloud Labs",
    techStack: ["Python 3.12", "LangChain", "Llama 3.1", "Qdrant Vector DB", "FastAPI", "Ollama"],
    description: "Build production-ready Retrieval-Augmented Generation (RAG) pipelines, multi-agent reasoning workflows, custom vector embeddings, and real-time LLM guardrails from scratch.",
    highlights: [
      "Vector search optimization & hybrid semantic search with Qdrant",
      "Building autonomous multi-agent systems with LangGraph & tool calling",
      "Chunking strategies, document parsing & reranking pipelines",
      "Deploying high-throughput LLM endpoints with FastAPI & streaming responses"
    ],
    spotsTotal: 50,
    spotsLeft: 14,
    level: "Intermediate to Advanced",
    price: "Free Course Registration",
    prerequisites: "Basic Python programming knowledge & understanding of REST APIs."
  },
  {
    id: "ws-react-nextjs-fullstack",
    categoryGroup: "web-dev",
    track: "WEB DEVELOPMENT",
    badge: "Hands-on Course",
    title: "Full-Stack React 19, Next.js 15 & Server Actions Workshop",
    duration: "5 Hours Deep Dive",
    mode: "Hybrid (Hyderabad & Online)",
    location: "Hyderabad & Online",
    venue: "NexziByte Innovation Hub, HITEC City, Hyderabad",
    techStack: ["React 19", "Next.js 15", "TypeScript", "Tailwind CSS", "Prisma ORM", "PostgreSQL"],
    description: "Master React Server Components (RSC), optimistic UI updates, Server Actions, streaming server-side rendering, and production authentication with NextAuth & PostgreSQL.",
    highlights: [
      "Deep dive into React 19 Actions, useActionState & useOptimistic hooks",
      "Building high-performance SSR/SSG apps with Next.js 15 App Router",
      "Database mutations with Server Actions and type-safe Prisma schema",
      "Performance tuning, Core Web Vitals optimization and edge deployment"
    ],
    spotsTotal: 40,
    spotsLeft: 9,
    level: "All Levels Welcome",
    price: "Free Course Registration",
    prerequisites: "Familiarity with modern JavaScript (ES6+) and basic React concepts."
  },
  {
    id: "ws-k8s-docker-devops",
    categoryGroup: "cloud-devops",
    track: "CLOUD & DEVOPS",
    badge: "Lab Bootcamp",
    title: "Zero-to-Hero Kubernetes, Docker & GitOps Pipeline Lab",
    duration: "6 Hours Cloud Sandbox",
    mode: "Live Cloud Sandbox (Online)",
    location: "Online / Cloud Lab",
    venue: "NexziByte Cloud Infrastructure Sandbox",
    techStack: ["Kubernetes", "Docker", "Terraform", "AWS EKS", "ArgoCD", "Prometheus"],
    description: "Hands-on containerization, multi-node Kubernetes cluster orchestration, infrastructure as code (IaC) with Terraform, and automated GitOps CI/CD delivery with ArgoCD.",
    highlights: [
      "Containerizing full-stack microservices with multi-stage Docker builds",
      "Configuring Kubernetes Deployments, Services, ConfigMaps & Ingress NGINX",
      "Automating multi-cloud infrastructure provisioning with Terraform",
      "Setting up zero-downtime canary rollouts and Prometheus monitoring"
    ],
    spotsTotal: 45,
    spotsLeft: 18,
    level: "Intermediate",
    price: "Free Course Registration",
    prerequisites: "Basic Linux CLI command understanding."
  },
  {
    id: "ws-python-backend-asyncio",
    categoryGroup: "python-backend",
    track: "PYTHON & SYSTEMS",
    badge: "Live Coding Intensive",
    title: "High-Throughput Python Asynchronous Backend Engineering",
    duration: "6 Hours Live Lab",
    mode: "Hybrid (Hyderabad & Online)",
    location: "Hyderabad & Online",
    venue: "NexziByte Tech Center, HITEC City, Hyderabad",
    techStack: ["Python 3.12", "FastAPI", "Asyncio", "Redis", "Celery", "PostgreSQL"],
    description: "Architect ultra-fast asynchronous REST & WebSocket APIs, event-driven task queues with Celery & Redis, connection pooling, and distributed caching strategies.",
    highlights: [
      "Mastering Python Asyncio event loops, coroutines, and task groups",
      "Building high-concurrency microservices with FastAPI & Pydantic v2",
      "Background worker queues & distributed scheduling with Celery + Redis",
      "Database connection pooling, async SQLAlchemy and indexing tuning"
    ],
    spotsTotal: 35,
    spotsLeft: 11,
    level: "Intermediate",
    price: "Free Course Registration",
    prerequisites: "Working knowledge of Python core syntax."
  },
  {
    id: "ws-cybersecurity-threat-hunting",
    categoryGroup: "cybersecurity",
    track: "CYBERSECURITY",
    badge: "Red vs Blue Lab",
    title: "Zero-Trust Security, Penetration Testing & Threat Hunting",
    duration: "6 Hours Security Sandbox",
    mode: "Live Cyber Range (Online)",
    location: "Online / Cyber Range",
    venue: "NexziByte Virtual Cyber Range & Attack Simulation Lab",
    techStack: ["Burp Suite", "Wireshark", "Metasploit", "OAuth 2.1", "HashiCorp Vault", "Kali Linux"],
    description: "Practical offensive and defensive security workshop: discover OWASP Top 10 vulnerabilities, conduct live API penetration tests, exploit misconfigurations, and implement Zero-Trust safeguards.",
    highlights: [
      "Live testing of SQLi, SSRF, IDOR, and JWT authorization bypass vulnerabilities",
      "Network packet analysis and real-time threat detection with Wireshark",
      "Implementing OAuth 2.1 / OIDC secure authentication flows",
      "Automating secrets management and cryptographic key rotation with Vault"
    ],
    spotsTotal: 30,
    spotsLeft: 7,
    level: "All Levels Welcome",
    price: "Free Course Registration",
    prerequisites: "Basic understanding of web protocols (HTTP/HTTPS) and networking."
  },
  {
    id: "ws-bigdata-kafka-spark",
    categoryGroup: "data-analytics",
    track: "DATA & ANALYTICS",
    badge: "Big Data Lab",
    title: "Real-Time Big Data Streaming with Apache Kafka & Spark",
    duration: "6 Hours Big Data Workshop",
    mode: "Live Big Data Cluster (Online)",
    location: "Online / Distributed Cluster",
    venue: "NexziByte Big Data Cluster Studio",
    techStack: ["Apache Kafka", "Apache Spark", "PySpark", "Snowflake", "dbt", "PostgreSQL"],
    description: "Construct enterprise real-time data streaming architectures: produce and consume Kafka topics, perform windowed streaming transformations with Spark Structured Streaming, and load into analytical warehouses.",
    highlights: [
      "Designing fault-tolerant Apache Kafka cluster topologies & schema registries",
      "Real-time event transformations and aggregations with PySpark",
      "Building modern medallion lakehouse architecture (Bronze, Silver, Gold)",
      "Automated ELT pipeline orchestration with dbt and cloud warehouses"
    ],
    spotsTotal: 40,
    spotsLeft: 15,
    level: "Intermediate",
    price: "Free Course Registration",
    prerequisites: "Basic Python and SQL querying background."
  },
  {
    id: "ws-java-spring-boot-microservices",
    categoryGroup: "java-spring",
    track: "JAVA & MICROSERVICES",
    badge: "Architecture Masterclass",
    title: "Enterprise Microservices with Spring Boot 3 & Spring Cloud",
    duration: "6 Hours Architecture Lab",
    mode: "Hybrid (Hyderabad & Online)",
    location: "Hyderabad & Online",
    venue: "NexziByte Tech Center, HITEC City, Hyderabad",
    techStack: ["Java 21", "Spring Boot 3", "Spring Cloud", "Resilience4j", "Docker", "PostgreSQL"],
    description: "Deep dive into building resilient, scalable enterprise microservices using Java 21 Virtual Threads, Spring Boot 3, Spring Cloud Gateway, distributed tracing, and the Saga pattern.",
    highlights: [
      "Leveraging Java 21 Virtual Threads (Project Loom) for high throughput",
      "API Gateway routing, rate-limiting, and JWT authentication filters",
      "Implementing circuit breakers and fallbacks with Resilience4j",
      "Distributed transaction orchestration with Kafka and Saga pattern"
    ],
    spotsTotal: 35,
    spotsLeft: 12,
    level: "Intermediate to Advanced",
    price: "Free Course Registration",
    prerequisites: "Working knowledge of Java core and OOP concepts."
  },
  {
    id: "ws-flutter-mobile-engineering",
    categoryGroup: "mobile-dev",
    track: "MOBILE ENGINEERING",
    badge: "Live App Build Lab",
    title: "Cross-Platform Mobile App Development with Flutter 3 & Dart",
    duration: "5 Hours Live App Build",
    mode: "Live Interactive Lab (Online)",
    location: "Online / Mobile Lab",
    venue: "NexziByte Mobile Development Studio",
    techStack: ["Flutter 3", "Dart", "Riverpod", "Firebase", "REST APIs", "SQLite"],
    description: "Design and build a polished, production-grade 60fps mobile application for Android & iOS from scratch with state management, offline persistence, and cloud sync.",
    highlights: [
      "Mastering Flutter reactive UI widget trees and custom animations",
      "Robust state management and dependency injection using Riverpod 2.0",
      "Offline-first local caching with SQLite & background sync",
      "Integrating push notifications, analytics, and app store release workflows"
    ],
    spotsTotal: 40,
    spotsLeft: 19,
    level: "All Levels Welcome",
    price: "Free Course Registration",
    prerequisites: "Basic programming concepts in any object-oriented language."
  }
];
