/* ══════════════════════════════════════════════════════════════════
   NEXZIBYTE TECHTALK — DETAILED COURSE SYLLABUS & CURRICULUM MATTER
   Provides comprehensive module-by-module syllabus, learning outcomes,
   capstone projects, prerequisites, and tools for all 64+ courses.
   ══════════════════════════════════════════════════════════════════ */

// Hand-crafted in-depth curricula for flagship technology courses
export const FLAGSHIP_CURRICULA = {
  // ─── C++ PROGRAMMING ──────────────────────────────────────────
  "cpp-programming": {
    prerequisites: "Understanding of basic programming constructs (variables, loops, conditions) in any language or foundational C.",
    targetAudience: "Systems engineers, high-frequency trading candidates, game developers, backend architects, and performance-critical systems developers.",
    totalHours: "70+ Hours Practical Labs & Code Teardowns",
    learningOutcomes: [
      "Master modern C++17 and C++20 language features, move semantics, and rvalue references.",
      "Architect memory-safe systems utilizing RAII and smart pointers (std::unique_ptr, std::shared_ptr).",
      "Deep dive into Standard Template Library (STL) containers, allocators, and algorithms.",
      "Implement multi-threaded concurrency with std::thread, mutexes, condition variables, and lock-free primitives.",
      "Profile and eliminate cache misses, memory leaks, and CPU bottlenecks using Valgrind, GDB, and Perf.",
      "Build production-grade build pipelines with CMake and unit test suites with GoogleTest."
    ],
    modules: [
      {
        number: "01",
        title: "Modern C++ Foundations & Memory Architecture",
        duration: "Weeks 1 - 2",
        summary: "Low-level machine model, memory layouts, pointer mechanics, and fundamental modern syntax.",
        topics: [
          "C++ compilation model (Pre-processor, Compiler, Assembler, Linker) & CMake basics",
          "Virtual memory architecture: Stack vs. Heap allocation, pointer arithmetic & references",
          "Dynamic memory management: new/delete vs. manual memory leaks and double-free traps",
          "Functions, pass-by-value vs pass-by-reference, const correctness, and inline functions",
          "Header files, translation units, inline namespaces, and modular source organization"
        ],
        handsOnLab: "Custom dynamic array buffer with bounds checking and memory tracking"
      },
      {
        number: "02",
        title: "Object-Oriented Design & RAII Mastery",
        duration: "Weeks 2 - 3",
        summary: "Resource Acquisition Is Initialization (RAII), lifecycle management, and class architectures.",
        topics: [
          "Constructors (default, parameterized, copy), destructors, and member initialization lists",
          "RAII idiom: automatic deterministic resource cleanup for files, sockets, and memory",
          "Operator overloading, copy assignment operators, and deep vs. shallow copying",
          "Rule of Three / Rule of Five / Rule of Zero in modern C++",
          "Inheritance, virtual functions, vtables, runtime polymorphism, and abstract interfaces"
        ],
        handsOnLab: "Thread-safe File & Network Socket RAII Wrapper with automatic resource cleanup"
      },
      {
        number: "03",
        title: "Move Semantics & Modern C++17/20 Features",
        duration: "Weeks 4 - 5",
        summary: "Zero-cost abstractions, rvalue references, compile-time evaluation, and concepts.",
        topics: [
          "Lvalues vs Rvalues, rvalue references (&&), and std::move mechanics",
          "Move constructors and move assignment operators for zero-copy performance",
          "Smart pointers: std::unique_ptr, std::shared_ptr, std::weak_ptr and custom deleters",
          "Compile-time computation: constexpr, consteval, and type deduction (auto, decltype)",
          "Modern C++20 Concepts, structured bindings, std::optional, std::variant, and std::string_view"
        ],
        handsOnLab: "Zero-copy High-Performance Circular Ring Buffer with move semantics"
      },
      {
        number: "04",
        title: "Standard Template Library (STL) & Generic Programming",
        duration: "Weeks 5 - 6",
        summary: "Templates, STL containers, iterators, and high-performance algorithms.",
        topics: [
          "Function templates, class templates, template specialization, and variadic templates",
          "Sequence containers (std::vector, std::deque, std::list) & memory reallocation strategies",
          "Associative containers (std::set, std::map) vs. Hash tables (std::unordered_map)",
          "Iterators categories, range-based loops, and modern C++20 std::ranges pipelines",
          "STL algorithms: std::sort, std::find_if, std::transform, std::accumulate, and custom lambdas"
        ],
        handsOnLab: "Custom generic LRU (Least Recently Used) Cache using STL lists and hash maps"
      },
      {
        number: "05",
        title: "Concurrency, Multithreading & Lock-Free Systems",
        duration: "Weeks 7 - 8",
        summary: "Parallel computation, race conditions, synchronization, and atomic operations.",
        topics: [
          "Process vs. Thread architecture, std::thread lifecycle, and std::jthread in C++20",
          "Race conditions, data races, std::mutex, std::unique_lock, and std::lock_guard",
          "Inter-thread communication with std::condition_variable, std::future, and std::async",
          "Memory models, atomic operations (std::atomic), memory fences, and lock-free programming concepts",
          "Thread pool implementation and CPU affinity assignment for deterministic latency"
        ],
        handsOnLab: "Multi-threaded Work-Stealing Task Scheduler and Thread Pool"
      },
      {
        number: "06",
        title: "Enterprise Capstone & Profiling Teardown",
        duration: "Week 8",
        summary: "End-to-end production architecture, profiling, benchmarking, and unit testing.",
        topics: [
          "Automated building with CMake, Ninja, and compiler flags (-O3, -Wall, -Wextra, -pedantic)",
          "Unit testing with GoogleTest (gtest) and mock objects (gmock)",
          "Memory profiling with Valgrind Memcheck and AddressSanitizer (ASan)",
          "CPU profiling and cache miss analysis using Linux Perf and Google Benchmark",
          "Packaging and deployment for Linux production environments"
        ],
        handsOnLab: "Production Limit Order Book (LOB) Matching Engine with sub-microsecond latency"
      }
    ],
    projects: [
      {
        title: "Ultra-Low Latency Order Book & Matching Engine",
        description: "A financial exchange matching engine built with modern C++ that processes limit and market orders with sub-microsecond order execution using lock-free data structures and custom arena allocators.",
        skills: ["C++20", "Lock-Free Queues", "Custom Allocator", "CMake", "GoogleTest"]
      },
      {
        title: "High-Performance Multi-Threaded HTTP/WebSocket Server",
        description: "An asynchronous epoll-backed network server handling 100,000+ concurrent TCP connections with zero-copy buffer pools and thread-safe request routing.",
        skills: ["epoll", "std::jthread", "Socket Programming", "RAII", "Valgrind ASan"]
      },
      {
        title: "Modern 3D Game Physics & Particle Simulation Engine",
        description: "A spatial partitioning particle collision system written using SIMD vectorization, cache-friendly data-oriented design (DOD), and modern C++ templates.",
        skills: ["SIMD Vectorization", "Data-Oriented Design", "Templates", "Linear Algebra"]
      }
    ],
    tools: ["GCC 13+", "Clang", "CMake", "GDB", "Valgrind", "AddressSanitizer", "GoogleTest", "Linux Perf"]
  },

  // ─── PYTHON ───────────────────────────────────────────────────
  "python": {
    prerequisites: "No prior programming experience required. Basic computer literacy and logical problem-solving aptitude.",
    targetAudience: "Aspiring software engineers, backend developers, automation specialists, data scientists, and DevOps practitioners.",
    totalHours: "65+ Hours Hands-On Labs & System Scripting",
    learningOutcomes: [
      "Master Python data structures, memory model, reference counting, and scope mechanics.",
      "Design scalable object-oriented architectures with design patterns, dunder methods, and dataclasses.",
      "Write high-throughput concurrent code using asyncio, multi-threading, and multi-processing.",
      "Integrate SQL databases (PostgreSQL/SQLite) with SQLAlchemy and raw connection pools.",
      "Consume and build RESTful APIs with FastAPI/Flask and validate inputs with Pydantic.",
      "Implement robust automated unit test suites with pytest, coverage, and mock fixtures."
    ],
    modules: [
      {
        number: "01",
        title: "Python Data Foundations & Control Flow",
        duration: "Weeks 1 - 2",
        summary: "Syntax essentials, dynamic typing, core collections, and functional programming constructs.",
        topics: [
          "Python 3.12 runtime, virtual environments (venv/uv), and execution lifecycle",
          "Primitive types, mutable vs immutable data, and string formatting (f-strings)",
          "Deep dive into Lists, Tuples, Dictionaries (hash maps), and Sets with Big-O complexities",
          "List/Dict/Set comprehensions, generator expressions, and memory-efficient iterators",
          "First-class functions, closures, decorators (@decorator), and lambda expressions"
        ],
        handsOnLab: "CLI Log File Parsing & Metric Extraction Automation Utility"
      },
      {
        number: "02",
        title: "Object-Oriented Python & System Design",
        duration: "Weeks 3 - 4",
        summary: "Enterprise OOP principles, inheritance, magic dunder methods, and modern dataclasses.",
        topics: [
          "Classes, instances, self convention, class attributes vs instance attributes",
          "Encapsulation, property decorators (@property, @setter), and dunder methods (__str__, __repr__, __len__, __getitem__)",
          "Inheritance, method resolution order (MRO), mixins, and abstract base classes (abc)",
          "Context managers (__enter__, __exit__) and custom with-statement resource handlers",
          "Modern dataclasses, Type Hints (typing module), and runtime validation with Pydantic"
        ],
        handsOnLab: "Bank Transaction Engine with Audit Logs and Custom Context Managers"
      },
      {
        number: "03",
        title: "File Systems, APIs & Database Persistence",
        duration: "Weeks 5 - 6",
        summary: "I/O operations, JSON/CSV parsing, networking, and relational database connectivity.",
        topics: [
          "Pathlib and robust cross-platform file manipulation (JSON, CSV, YAML)",
          "Consuming external REST APIs using requests and httpx with retry strategies and headers",
          "Relational database integration with PostgreSQL & SQLite using psycopg3 and sqlite3",
          "Object Relational Mapping (ORM) fundamentals with SQLAlchemy 2.0",
          "Transactions, ACID compliance, connection pooling, and migration workflows with Alembic"
        ],
        handsOnLab: "Automated Web Scraper & Multi-Source Data Ingestion Pipeline to PostgreSQL"
      },
      {
        number: "04",
        title: "Asynchronous Python, Testing & Capstone Deployment",
        duration: "Weeks 7 - 8",
        summary: "High-throughput asynchronous programming, testing frameworks, and production packaging.",
        topics: [
          "The Global Interpreter Lock (GIL) and its implications for Python concurrency",
          "Asynchronous I/O with asyncio (async/await, event loops, tasks, gathers, and queues)",
          "CPU-bound parallelism with multiprocessing vs. I/O-bound concurrency with threading",
          "Unit testing with pytest, parameterization, mocks, and code coverage reporting",
          "Packaging CLI tools with Click/Argparse and containerizing with Docker"
        ],
        handsOnLab: "High-Throughput Async REST Web Service with FastAPI, Celery, and Redis Caching"
      }
    ],
    projects: [
      {
        title: "Distributed Task Queue & Background Worker System",
        description: "An asynchronous distributed task processing pipeline similar to Celery built using Python asyncio, Redis pub/sub message brokers, and PostgreSQL.",
        skills: ["Python 3", "Asyncio", "Redis", "PostgreSQL", "Pytest"]
      },
      {
        title: "E-Commerce RESTful Microservice with FastAPI & SQLAlchemy",
        description: "A production REST API featuring JWT authentication, automated API documentation, database connection pooling, and full pytest test coverage.",
        skills: ["FastAPI", "SQLAlchemy 2.0", "JWT Auth", "Pydantic", "Docker"]
      }
    ],
    tools: ["Python 3.12", "pytest", "FastAPI", "SQLAlchemy", "PostgreSQL", "Docker", "VS Code", "Git"]
  },

  // ─── JAVA ─────────────────────────────────────────────────────
  "java": {
    prerequisites: "Basic programming logic or procedural coding background.",
    targetAudience: "Enterprise software engineers, backend developers, banking and fintech systems developers.",
    totalHours: "75+ Hours Enterprise Architecture & Hands-On Labs",
    learningOutcomes: [
      "Deep understanding of JVM internals: ClassLoader, Heap/Stack, Garbage Collectors (G1/ZGC).",
      "Master the Java Collections Framework (ArrayList, HashMap, ConcurrentHashMap, TreeSet).",
      "Write declarative, functional code with Java Streams API, Lambdas, and Optional.",
      "Build high-concurrency systems using java.util.concurrent (Executors, Locks, CompletableFuture).",
      "Implement robust database persistence with JDBC and Spring Data JPA / Hibernate.",
      "Write enterprise unit and integration tests using JUnit 5, Mockito, and AssertJ."
    ],
    modules: [
      {
        number: "01",
        title: "JVM Internals & Core Java Foundations",
        duration: "Weeks 1 - 2",
        summary: "Java 17/21 LTS syntax, memory structure, and runtime byte code execution.",
        topics: [
          "Java Virtual Machine (JVM), JRE, JDK architecture and byte code execution",
          "Memory management: JVM Stack, Heap, Metaspace, and Garbage Collection mechanics",
          "Type system, primitives vs. wrappers, autoboxing, and String immutability pool",
          "Exception hierarchy: Checked vs. Unchecked exceptions and try-with-resources",
          "Package architecture, access specifiers, and modular compilation with Maven"
        ],
        handsOnLab: "JVM Memory Profiling & Custom Immutable Class Architecture"
      },
      {
        number: "02",
        title: "OOP Design Patterns & Collections Framework",
        duration: "Weeks 3 - 4",
        summary: "Enterprise OOP principles, Gang of Four design patterns, and Collections data structures.",
        topics: [
          "Polymorphism, Interfaces vs Abstract classes, and Default methods in Java 8+",
          "Core Design Patterns: Singleton, Factory, Builder, Observer, and Strategy",
          "List implementations: ArrayList vs LinkedList (internals, time complexity)",
          "Map implementations: HashMap (hashing algorithm, buckets, treeification) vs TreeMap",
          "Set, Queue, Deque, PriorityQueue, and Comparable vs Comparator sorting"
        ],
        handsOnLab: "Enterprise Order Routing Engine utilizing Strategy and Builder Patterns"
      },
      {
        number: "03",
        title: "Functional Java, Streams & Modern Concurrency",
        duration: "Weeks 5 - 6",
        summary: "Lambdas, Stream pipelines, multithreading, and asynchronous programming.",
        topics: [
          "Functional interfaces (Predicate, Consumer, Function, Supplier) & Lambda expressions",
          "Java Streams API: intermediate operations (filter, map, flatMap) & terminal collectors",
          "Multithreading fundamentals: Thread lifecycle, synchronized blocks, and volatile keyword",
          "java.util.concurrent: ExecutorService, ThreadPoolExecutor, Callable, and Future",
          "Modern asynchronous programming with CompletableFuture and Java 21 Virtual Threads"
        ],
        handsOnLab: "High-Throughput Parallel Batch Processor using Virtual Threads & Streams"
      },
      {
        number: "04",
        title: "Enterprise Persistence & Spring Boot Integration",
        duration: "Weeks 7 - 8",
        summary: "Database connectivity, Spring Boot microservices, and automated testing.",
        topics: [
          "Database persistence with JDBC: PreparedStatement, Transactions, and HikariCP connection pools",
          "Spring Boot fundamentals: Inversion of Control (IoC), Dependency Injection, and Autowiring",
          "Building RESTful APIs with @RestController, request validation, and global exception handlers",
          "ORM with Spring Data JPA and Hibernate entity relationships (@OneToMany, @ManyToMany)",
          "Enterprise testing with JUnit 5, Mockito mocking framework, and integration tests"
        ],
        handsOnLab: "Production-Ready Banking & Payment Microservice with Spring Boot & PostgreSQL"
      }
    ],
    projects: [
      {
        title: "FinTech Transaction Clearing & Settlement System",
        description: "An enterprise Java service simulating real-time banking transfers with double-entry ledger bookkeeping, ACID database transactions, and idempotent API endpoints.",
        skills: ["Java 17/21", "Spring Boot", "PostgreSQL", "HikariCP", "JUnit 5", "Mockito"]
      },
      {
        title: "High-Concurrency Real-Time Notification Microservice",
        description: "A distributed notification service sending millions of multi-channel push notifications using Java 21 Virtual Threads, CompletableFuture, and Kafka.",
        skills: ["Virtual Threads", "CompletableFuture", "Kafka", "REST API", "Docker"]
      }
    ],
    tools: ["Java 17/21", "Spring Boot", "Maven", "IntelliJ IDEA", "PostgreSQL", "JUnit 5", "Mockito", "Docker"]
  },

  // ─── C PROGRAMMING ───────────────────────────────────────────
  "c-programming": {
    prerequisites: "None. Open to students and beginners looking for low-level foundational computer science mastery.",
    targetAudience: "Embedded software engineers, firmware developers, operating system researchers, and hardware-software interface developers.",
    totalHours: "50+ Hours Low-Level Coding & Hardware Abstractions",
    learningOutcomes: [
      "Master manual memory allocation, pointer arithmetic, stack/heap layout, and memory leaks.",
      "Understand computer hardware architecture from CPU registers to cache hierarchy and RAM.",
      "Build complex dynamic data structures (Linked Lists, Binary Search Trees, Hash Tables) in pure C.",
      "Master bit manipulation, bitwise flags, structs, unions, and packed memory structures.",
      "Interface with operating system kernels via POSIX system calls (fork, exec, read, write, pipe).",
      "Debug segmentation faults and buffer overflows using GDB, Valgrind, and LLVM Sanitizers."
    ],
    modules: [
      {
        number: "01",
        title: "C Syntax, Types & Low-Level Compilation",
        duration: "Weeks 1 - 2",
        summary: "Machine representation of data, compilation toolchains, and control structures.",
        topics: [
          "The C Compilation pipeline: preprocessor (#include, #define), compiler, assembler, linker",
          "Data types, integer overflow, signed vs unsigned representation, two's complement",
          "Operators, control flow (loops, branches, switch) and scoping rules",
          "Arrays, multi-dimensional buffers, and C-style null-terminated strings",
          "Modular code organization: header files (.h), source files (.c), and Makefile automation"
        ],
        handsOnLab: "Command-Line Hex Viewer & Binary File Inspector"
      },
      {
        number: "02",
        title: "Pointers & Dynamic Memory Architecture",
        duration: "Weeks 3 - 4",
        summary: "Pointer arithmetic, dynamic memory allocation, and debugging memory errors.",
        topics: [
          "Addresses, dereferencing, pointer-to-pointer (**ptr), and void* generic pointers",
          "Dynamic memory management: malloc, calloc, realloc, and free mechanics",
          "Common memory bugs: dangling pointers, memory leaks, double free, and buffer overflows",
          "Structs, memory alignment, padding, offsetof, and unions for type punning",
          "Function pointers, callback mechanisms, and implementing pseudo-polymorphism in C"
        ],
        handsOnLab: "Custom Dynamic Memory Allocator (Mini-malloc with free list and coalescing)"
      },
      {
        number: "03",
        title: "Data Structures from Scratch in Pure C",
        duration: "Weeks 4 - 5",
        summary: "Implementing robust fundamental data structures without external libraries.",
        topics: [
          "Single and doubly linked lists with memory cleanup and iterator traversal",
          "Stack and queue implementations using dynamic resizing arrays and linked nodes",
          "Binary Search Trees (BST) with recursive insertions, deletions, and traversals",
          "Hash tables with custom hash functions (djb2) and collision resolution (chaining)",
          "Bitwise operations, bit masks, bit fields, and low-level flags manipulation"
        ],
        handsOnLab: "High-Performance In-Memory Key-Value Store with Hash Table Collision Handling"
      },
      {
        number: "04",
        title: "POSIX System Calls, File I/O & OS Interfaces",
        duration: "Weeks 5 - 6",
        summary: "Kernel interactions, file descriptors, process management, and IPC.",
        topics: [
          "Standard I/O (fopen, fread, fwrite) vs. POSIX low-level I/O (open, read, write, close)",
          "Process lifecycle in Unix/Linux: fork(), execvp(), wait(), and exit()",
          "Inter-process communication (IPC): pipes, signals (SIGINT, SIGKILL), and shared memory",
          "Memory-mapped files with mmap() for high-speed file processing",
          "Debugging segmentation faults with GDB and memory leak analysis with Valgrind"
        ],
        handsOnLab: "Custom Unix Shell (Mini-Bash) with Command Execution, Pipes & Redirections"
      }
    ],
    projects: [
      {
        title: "Custom Unix Command Shell (Mini-Bash)",
        description: "A functional command-line interpreter supporting built-in commands (cd, exit), external binary execution via fork/exec, pipeline redirection (|), and file redirection (>, <).",
        skills: ["C99", "POSIX API", "fork/exec", "Pipes", "GDB"]
      },
      {
        title: "Embedded Hardware Sensor Simulator & State Machine",
        description: "An embedded event-driven firmware simulator implementing finite state machines (FSM), circular DMA ring buffers, and bitwise packet telemetry decoding.",
        skills: ["Bitwise Flags", "State Machines", "Ring Buffers", "Valgrind", "Makefiles"]
      }
    ],
    tools: ["GCC", "Clang", "GDB", "Valgrind", "Make", "Linux CLI", "VS Code"]
  },

  // ─── JAVASCRIPT ───────────────────────────────────────────────
  "javascript": {
    prerequisites: "Basic HTML & CSS knowledge.",
    targetAudience: "Frontend developers, full-stack engineers, web application developers, and node.js engineers.",
    totalHours: "60+ Hours Hands-On Browser & Node Runtime Labs",
    learningOutcomes: [
      "Deep command of ECMAScript (ES6 to ES2024), closures, scope chain, and prototype inheritance.",
      "Master the browser event loop, call stack, task queue, microtasks (Promises), and async/await.",
      "Manipulate the DOM efficiently with modern Web APIs, Event Delegation, and Shadow DOM.",
      "Build modular frontend architectures with ES Modules (import/export) and Vite bundling.",
      "Consume REST and GraphQL APIs with fetch, AbortController, and streaming response readers.",
      "Debug performance, memory leaks, and network bottlenecks using Chrome DevTools."
    ],
    modules: [
      {
        number: "01",
        title: "Modern JS Execution & Core Mechanics",
        duration: "Weeks 1 - 2",
        summary: "Execution context, lexical environment, variable hoisting, and scope chains.",
        topics: [
          "JS runtime architecture: Call Stack, Memory Heap, and V8 engine compilation stages",
          "Scope: Global, Function, Block scope, let/const vs. var, and hoisting mechanics",
          "Lexical scope, Closures, function factories, and data encapsulation patterns",
          "this keyword binding rules (Default, Implicit, Explicit with call/apply/bind, and Arrow functions)",
          "Object models, Prototype chain (__proto__ vs prototype), and modern ES6 class syntax"
        ],
        handsOnLab: "Custom Event Emitter & Pub-Sub Library using Closures and Prototypes"
      },
      {
        number: "02",
        title: "Asynchronous JavaScript & Event Loop",
        duration: "Weeks 3 - 4",
        summary: "Promises, async/await, microtask vs macrotask execution, and modern fetch.",
        topics: [
          "Single-threaded runtime, Event Loop, Call Stack, Task Queue vs Microtask Queue",
          "Callback hell and transition to Promises (Promise states, chaining, error handling)",
          "Promise combinators: Promise.all, Promise.allSettled, Promise.race, Promise.any",
          "async/await syntax sugar, top-level await, and try/catch error handling patterns",
          "Modern Fetch API, AbortController for request cancellation, and stream response decoding"
        ],
        handsOnLab: "Resilient API Client with Auto-Retry, Exponential Backoff, and Request Caching"
      },
      {
        number: "03",
        title: "DOM Engineering, Browser APIs & Web Storage",
        duration: "Weeks 4 - 5",
        summary: "DOM manipulation, event delegation, web workers, and client storage.",
        topics: [
          "DOM tree traversal, document fragments, innerHTML security hazards (XSS), and safe DOM methods",
          "Event propagation: Capturing phase, Target phase, Bubbling phase, and Event Delegation",
          "Intersection Observer API for lazy loading images and infinite scroll feeds",
          "Browser Storage: localStorage, sessionStorage, IndexedDB, and secure Cookie management",
          "Web Workers for offloading intensive CPU tasks to background threads"
        ],
        handsOnLab: "Infinite Scroll Dynamic Content Feed with Intersection Observer & IndexedDB Cache"
      },
      {
        number: "04",
        title: "Modular Architecture, Tooling & Capstone SPA",
        duration: "Weeks 5 - 6",
        summary: "ES Modules, modern bundlers (Vite), testing, and building a standalone Single Page App.",
        topics: [
          "ES Modules (import/export), dynamic imports (import()), and code-splitting",
          "Modern build tooling with Vite, npm package management, and ESLint/Prettier setup",
          "State management patterns: reactive state stores and observer models",
          "Single Page App routing using the History API (pushState/popstate)",
          "Unit testing JavaScript logic with Vitest / Jest"
        ],
        handsOnLab: "Vanilla JS Interactive Kanban / Trello Board with Drag & Drop API & State Persistence"
      }
    ],
    projects: [
      {
        title: "Real-Time Collaborative Kanban Board",
        description: "A drag-and-drop workflow board built in modern vanilla JavaScript using the HTML5 Drag & Drop API, Custom Event buses, and localStorage synchronization.",
        skills: ["ES6+", "Drag & Drop API", "Custom Events", "Vite", "IndexedDB"]
      },
      {
        title: "Interactive Financial Stocks Dashboard",
        description: "A high-performance stock tracking application featuring live WebSocket ticker feeds, chart rendering with Canvas API, and request debouncing.",
        skills: ["WebSockets", "Canvas API", "Fetch & Async", "AbortController"]
      }
    ],
    tools: ["Node.js", "Vite", "Chrome DevTools", "Vitest", "ESLint", "Git"]
  },

  // ─── REACT JS ─────────────────────────────────────────────────
  "react-js": {
    prerequisites: "Good understanding of JavaScript (ES6+), HTML, and CSS.",
    targetAudience: "Frontend engineers, full-stack developers, Single Page Application (SPA) creators.",
    totalHours: "70+ Hours Modern React 18/19 Architecture",
    learningOutcomes: [
      "Master React 18+ component lifecycles, virtual DOM reconciliation, and Fiber architecture.",
      "Build complex UI state workflows with custom hooks, useReducer, and Context API.",
      "Scale global state management with Redux Toolkit (RTK) and Zustand.",
      "Implement declarative routing, protected routes, and data loaders with React Router v6.",
      "Optimize performance with useMemo, useCallback, React.memo, and code-splitting (lazy/Suspense).",
      "Deploy production React apps to cloud hosts (Vercel, Netlify, AWS S3/CloudFront)."
    ],
    modules: [
      {
        number: "01",
        title: "React Fundamentals & Component Architecture",
        duration: "Weeks 1 - 2",
        summary: "JSX syntax, props, component composition, and unidirectional data flow.",
        topics: [
          "React architecture: Declarative UI, Virtual DOM, and Reconciliation (Fiber engine)",
          "JSX syntax rules, embedding expressions, and conditional rendering patterns",
          "Component types: Functional components, props destructing, default props, and children prop",
          "useState hook: immutability principles, state batching, and handling arrays/objects in state",
          "Lifting state up and controlled vs. uncontrolled form inputs"
        ],
        handsOnLab: "Interactive Product Catalog with Multi-Filter, Search, and Cart Counters"
      },
      {
        number: "02",
        title: "Hooks Deep Dive & Side Effect Management",
        duration: "Weeks 2 - 3",
        summary: "useEffect, useRef, custom hooks, and memory leak prevention.",
        topics: [
          "useEffect hook: dependency arrays, lifecycle simulation, and cleanup functions",
          "Data fetching patterns with Axios/fetch, loading states, and error handling",
          "useRef hook: DOM node referencing, mutable values across renders, and timers",
          "Building reusable Custom Hooks (useFetch, useDebounce, useLocalStorage, useWindowSize)",
          "useReducer hook for managing complex multi-step state transitions"
        ],
        handsOnLab: "Full-Featured Multi-Step Onboarding Form with Custom Form Validation Hook"
      },
      {
        number: "03",
        title: "State Management: Context API & Redux Toolkit",
        duration: "Weeks 4 - 5",
        summary: "Prop drilling solutions, Context API, and enterprise Redux Toolkit (RTK).",
        topics: [
          "React Context API: createContext, useContext, and optimizing Context providers",
          "Redux Toolkit (RTK): Store configuration, Slices, reducers, and action creators",
          "Async data handling with RTK Query and createAsyncThunk for API integration",
          "Lightweight alternative: Zustand state management with zero boilerplate",
          "Client-side routing with React Router v6: Route matching, URL params, nested routes, and route guards"
        ],
        handsOnLab: "Enterprise E-Commerce Storefront with RTK Shopping Cart, Filters & Checkout Flow"
      },
      {
        number: "04",
        title: "Performance Tuning, Testing & Deployment",
        duration: "Weeks 6 - 7",
        summary: "Optimization strategies, automated testing, and production builds.",
        topics: [
          "Performance profiling: React Developer Tools Profiler and wasted render elimination",
          "Optimization hooks: useMemo, useCallback, React.memo, and stable function references",
          "Code-splitting with React.lazy and Suspense boundaries for fast initial page load",
          "Component testing with React Testing Library (RTL) and Vitest/Jest",
          "Building production bundles with Vite and deploying to Vercel/Netlify"
        ],
        handsOnLab: "High-Performance Analytics SaaS Dashboard with Live Charts & Dark Theme"
      }
    ],
    projects: [
      {
        title: "Enterprise SaaS Analytics & Team Collaboration Portal",
        description: "A production Single Page Application featuring interactive dashboards, role-based access control, dark/light theme toggle, real-time filters, and Redux Toolkit state persistence.",
        skills: ["React 18", "Redux Toolkit", "React Router v6", "TailwindCSS", "Vitest"]
      },
      {
        title: "Streaming Media Platform with Video Player & Recommendations",
        description: "A responsive media streaming platform with custom video controls, debounced search suggestions, infinite scrolling, and protected user watchlists.",
        skills: ["React Hooks", "Context API", "Custom Video Player", "Vite"]
      }
    ],
    tools: ["React 18/19", "Vite", "Redux Toolkit", "React Router", "TailwindCSS", "Vitest", "Vercel"]
  },

  // ─── AWS CLOUD ────────────────────────────────────────────────
  "aws": {
    prerequisites: "Basic Linux CLI command understanding and networking fundamentals.",
    targetAudience: "Cloud engineers, DevOps engineers, systems administrators, and backend architects.",
    totalHours: "70+ Hours AWS Cloud Sandbox Labs",
    learningOutcomes: [
      "Architect highly available, fault-tolerant systems on Amazon Web Services (AWS).",
      "Deploy compute instances with EC2, Auto Scaling Groups, and Elastic Load Balancing (ALB).",
      "Design secure networking topologies using VPC, Subnets, Route Tables, NAT Gateways, and Security Groups.",
      "Store and manage data with S3, EBS, EFS, RDS (PostgreSQL/MySQL), and DynamoDB NoSQL.",
      "Build serverless architectures using AWS Lambda, API Gateway, SQS, SNS, and EventBridge.",
      "Prepare for AWS Certified Solutions Architect - Associate (SAA-C03) certification."
    ],
    modules: [
      {
        number: "01",
        title: "AWS Cloud Foundations & Identity (IAM)",
        duration: "Weeks 1 - 2",
        summary: "Cloud computing models, AWS global infrastructure, and security best practices.",
        topics: [
          "AWS Global Infrastructure: Regions, Availability Zones (AZs), and Edge Locations",
          "AWS Identity and Access Management (IAM): Users, User Groups, IAM Roles, and Policies",
          "Multi-Factor Authentication (MFA), least privilege security, and AWS Organizations",
          "AWS CLI setup, programmatic access keys, and IAM Role assumption",
          "Billing alarms, AWS Budgets, and AWS Free Tier monitoring"
        ],
        handsOnLab: "Enterprise Multi-Department IAM Security Architecture with Custom Policies"
      },
      {
        number: "02",
        title: "Compute (EC2) & Storage (S3, EBS, EFS)",
        duration: "Weeks 2 - 3",
        summary: "Virtual server management, storage tiers, and high-availability file systems.",
        topics: [
          "Amazon EC2: Instance types, pricing models (On-Demand, Spot, Reserved), and SSH key pairs",
          "EC2 User Data bootstrap automation, AMI creation, and system monitoring with CloudWatch",
          "Elastic Block Store (EBS): gp3 volumes, IOPS, snapshots, and lifecycle policies",
          "Elastic File System (EFS) for shared network storage across multiple instances",
          "Amazon S3: Buckets, object versioning, storage classes, lifecycle rules, and static website hosting"
        ],
        handsOnLab: "Automated EC2 Web Server Cluster with EBS Snapshots & S3 Media Bucket"
      },
      {
        number: "03",
        title: "Virtual Private Cloud (VPC) Networking & High Availability",
        duration: "Weeks 4 - 5",
        summary: "Isolated cloud networking, subnets, gateways, and load balancer clusters.",
        topics: [
          "VPC architecture: CIDR block calculation, Public vs. Private Subnets, and Internet Gateways",
          "Route Tables, NAT Gateways for secure private subnet outbound access, and Bastion Hosts",
          "Security Groups (stateful) vs. Network Access Control Lists (NACLs, stateless)",
          "Elastic Load Balancing (ALB vs. NLB): Target groups, health checks, and SSL termination",
          "Auto Scaling Groups (ASG): Scaling policies (Target tracking, step scaling) across multiple AZs"
        ],
        handsOnLab: "3-Tier Multi-AZ VPC Architecture with Public ALB and Private Auto-Scaled Backend"
      },
      {
        number: "04",
        title: "Databases, Serverless & Monitoring",
        duration: "Weeks 6 - 7",
        summary: "Relational/NoSQL databases, event-driven serverless, and observability.",
        topics: [
          "Amazon RDS: Multi-AZ deployments, read replicas, automated backups, and Aurora",
          "Amazon DynamoDB: NoSQL key-value architecture, Partition Keys, Sort Keys, and scaling modes",
          "Serverless computing with AWS Lambda, API Gateway REST endpoints, and trigger sources",
          "Asynchronous messaging: Amazon SQS queues, SNS notifications, and EventBridge buses",
          "Observability with Amazon CloudWatch Metrics, Alarms, Logs, and AWS CloudTrail auditing"
        ],
        handsOnLab: "Serverless Event-Driven Image Thumbnail Generation with S3, Lambda & DynamoDB"
      }
    ],
    projects: [
      {
        title: "Enterprise 3-Tier Multi-AZ High-Availability Web Application",
        description: "A production architecture featuring an Application Load Balancer in public subnets, an Auto Scaling Group of EC2 instances in private subnets, and an Amazon Aurora Multi-AZ database cluster.",
        skills: ["AWS VPC", "EC2 Auto Scaling", "ALB", "Aurora RDS", "CloudWatch"]
      },
      {
        title: "Serverless Microservice Pipeline with Lambda & DynamoDB",
        description: "An event-driven serverless REST API that processes payments, publishes audit events to SQS, and stores transactional records in DynamoDB with automated CloudWatch alarms.",
        skills: ["AWS Lambda", "API Gateway", "DynamoDB", "SQS", "CloudWatch"]
      }
    ],
    tools: ["AWS Management Console", "AWS CLI", "CloudFormation", "Terraform", "PostgreSQL", "Linux"]
  }
};

/**
 * Intelligently retrieves or generates complete, rich course matter for any course.
 * If the course has a flagship curriculum defined, it returns that.
 * Otherwise, it dynamically constructs a comprehensive 4-to-5 module syllabus tailored
 * to the course's exact title, category, tags, duration, and roles.
 */
export function getCourseCurriculum(course) {
  if (!course) return null;

  // 1. Check if an explicit flagship curriculum exists
  if (FLAGSHIP_CURRICULA[course.id]) {
    return {
      ...FLAGSHIP_CURRICULA[course.id],
      isFlagship: true
    };
  }

  // 2. Generate a tailored, professional syllabus dynamically
  const title = course.title || "Technology Course";
  const tags = course.tags && course.tags.length > 0 ? course.tags : [title, "Core Architecture", "Hands-On Labs", "Production Best Practices"];
  const roles = course.roles || ["Software Engineer", "Technical Specialist"];
  const duration = course.duration || "6 to 8 Weeks";

  // Slice tags into 4 distinct module focuses
  const chunk1 = tags.slice(0, Math.ceil(tags.length / 4));
  const chunk2 = tags.slice(Math.ceil(tags.length / 4), Math.ceil(tags.length / 2));
  const chunk3 = tags.slice(Math.ceil(tags.length / 2), Math.ceil((tags.length * 3) / 4));
  const chunk4 = tags.slice(Math.ceil((tags.length * 3) / 4));

  const modules = [
    {
      number: "01",
      title: `${title} Architecture & Core Foundations`,
      duration: "Weeks 1 - 2",
      summary: `Foundational syntax, runtime mechanics, environment setup, and architectural fundamentals of ${title}.`,
      topics: [
        `Introduction to ${title} ecosystem, installation, runtime lifecycle, and modern toolchains`,
        `Core constructs, data structures, type systems, and operational paradigms`,
        `Coding standards, best practices, and clean architecture conventions`,
        ...(chunk1.length > 0 ? chunk1.map(t => `Deep dive into ${t} in modern engineering`) : [`Configuration and modular layout in ${title}`]),
        "Hands-on foundational lab exercises and debugging techniques"
      ],
      handsOnLab: `${title} Initial Setup, Core Logic Architecture & Automated Test Validation`
    },
    {
      number: "02",
      title: `Intermediate Patterns & ${title} Deep Dive`,
      duration: "Weeks 3 - 4",
      summary: `Advanced features, design patterns, component modularity, and operational workflows.`,
      topics: [
        `Architectural design patterns and component composition in ${title}`,
        ...(chunk2.length > 0 ? chunk2.map(t => `Mastering ${t} for production use-cases`) : [`System state management and memory handling`]),
        `Error handling, exception propagation, and resilient fault tolerance`,
        `Interfacing with storage, file systems, and external service protocols`,
        `Performance optimizations and execution profiling fundamentals`
      ],
      handsOnLab: `Production-Grade Resilient Service Component in ${title}`
    },
    {
      number: "03",
      title: `Advanced Engineering, Scalability & Integrations`,
      duration: "Weeks 5 - 6",
      summary: `Concurrency, asynchronous workflows, data integration, and enterprise scaling.`,
      topics: [
        `Asynchronous execution, concurrency, and high-throughput communication`,
        ...(chunk3.length > 0 ? chunk3.map(t => `Advanced implementation of ${t}`) : [`API integration and data serialization protocols`]),
        `Security best practices, vulnerability prevention, and access controls`,
        `Database connectivity, caching layers, and persistence mechanisms`,
        `Automated unit, integration, and contract testing frameworks`
      ],
      handsOnLab: `High-Throughput Multi-Module Integrated Pipeline with Automated Testing`
    },
    {
      number: "04",
      title: `Enterprise Capstone, CI/CD & Production Delivery`,
      duration: "Weeks 7 - 8",
      summary: `Building end-to-end industry portfolio capstone, containerization, and cloud deployment.`,
      topics: [
        `Full-lifecycle enterprise capstone system architecture breakdown`,
        ...(chunk4.length > 0 ? chunk4.map(t => `Production deployment strategies for ${t}`) : [`Logging, monitoring, and telemetry instrumentation`]),
        `Containerization with Docker and CI/CD automated deployment pipelines`,
        `System teardown: code review guidelines, benchmarks, and portfolio packaging`,
        `Interview preparation, technical system design rounds, and industry certification paths`
      ],
      handsOnLab: `Complete End-to-End ${title} Industry Capstone Portfolio Project`
    }
  ];

  return {
    prerequisites: `Basic computer science awareness and interest in mastering ${title}. Any relevant prior coding experience is helpful.`,
    targetAudience: `Engineers, developers, and aspiring professionals targeting roles such as ${roles.slice(0, 3).join(", ")}.`,
    totalHours: `${duration} Intensive Hands-On Labs, Code Reviews & Capstone Projects`,
    learningOutcomes: [
      `Complete theoretical and hands-on mastery of ${title} and associated industry ecosystem.`,
      `Ability to architect, build, and deploy production-grade software or infrastructure using ${title}.`,
      `Hands-on practical experience implementing ${tags.slice(0, 4).join(", ")}.`,
      `Direct command over unit testing, debugging, system profiling, and performance tuning.`,
      `Delivery of a production portfolio capstone project ready for GitHub and recruiter evaluations.`
    ],
    modules,
    projects: [
      {
        title: `Enterprise Production ${title} Solution`,
        description: `An end-to-end production application demonstrating architectural design patterns, comprehensive unit testing, and modular scalable structure using ${title}.`,
        skills: tags.slice(0, 5)
      },
      {
        title: `Automated ${title} System Pipeline`,
        description: `A high-performance pipeline featuring automated data processing, robust error handling, metrics collection, and continuous integration workflows.`,
        skills: tags.slice(2, 6)
      }
    ],
    tools: tags.slice(0, 8)
  };
}
