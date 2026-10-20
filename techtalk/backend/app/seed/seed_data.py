import logging
from sqlalchemy.orm import Session
from app.database import Base, engine, SessionLocal
from app.models.user import User
from app.models.post import Category, Post
from app.models.event import Summit, FounderMeet
from app.models.speaker import Speaker
from app.models.registration import Registration
from app.services.auth_service import get_password_hash

logger = logging.getLogger("techtalk.seed")

def seed_database(db: Session = None):
    """Populates database with realistic tech community & event data"""
    owns_session = False
    if db is None:
        db = SessionLocal()
        owns_session = True

    try:
        # Create all tables first
        Base.metadata.create_all(bind=engine)

        # 1. Seed Categories
        categories_data = [
            {"id": "cat_ai", "name": "AI & Machine Learning", "slug": "ai-machine-learning", "description": "LLMs, Computer Vision, RAG Pipelines and Model Deployment", "icon": "Cpu"},
            {"id": "cat_arch", "name": "System Architecture", "slug": "system-architecture", "description": "Microservices, Distributed Systems, Event-Driven Architecture and Idempotency", "icon": "Layers"},
            {"id": "cat_web", "name": "React & Modern Web", "slug": "react-modern-web", "description": "React 19, Server Components, Vite, Performance and Design Systems", "icon": "Globe"},
            {"id": "cat_cloud", "name": "Cloud & DevOps", "slug": "cloud-devops", "description": "Kubernetes, Docker, AWS, CI/CD and Infrastructure as Code", "icon": "Cloud"},
            {"id": "cat_sec", "name": "Cybersecurity", "slug": "cybersecurity", "description": "Zero Trust, OAuth2, Cryptography and Web Application Security", "icon": "Shield"},
            {"id": "cat_data", "name": "Data Engineering", "slug": "data-engineering", "description": "Kafka, Spark, Data Warehousing, SQL Optimization and ETL", "icon": "Database"},
            {"id": "cat_startup", "name": "Startups & Venture", "slug": "startups-venture", "description": "Product-Market Fit, Bootstrapping, Seed Pitching and Scaling", "icon": "Rocket"},
        ]
        for c in categories_data:
            if not db.query(Category).filter(Category.id == c["id"]).first():
                db.add(Category(**c, post_count=12))

        # 2. Seed Admin User Only (nexzibyteadmin@gmail.com)
        admin_emails = ["nexzibyteadmin@gmail.com", "nexzibyte@gmail.com"]
        for a_email in admin_emails:
            admin_user = db.query(User).filter(User.email == a_email).first()
            if not admin_user:
                admin_user = User(
                    id=f"usr_admin_{a_email.split('@')[0]}",
                    email=a_email,
                    hashed_password=get_password_hash("admin"),
                    name="NexziByte Super Admin",
                    full_name="NexziByte TechTalk Admin",
                    role="admin",
                    title="Enterprise Platform Administrator",
                    phone="+91 98765 00000",
                    avatar_initials="NA",
                    bio="Super Administrator for NexziByte TechTalk Platform, Summits & Digital Pass Operations.",
                    location="Hyderabad, India",
                    is_verified=True,
                    is_active=True
                )
                db.add(admin_user)
            else:
                admin_user.role = "admin"
                admin_user.is_verified = True
                if not admin_user.hashed_password:
                    admin_user.hashed_password = get_password_hash("admin")

        # 3. Seed Posts
        posts_data = [
            {
                "id": "post_ai_rag",
                "title": "Production-Grade Hybrid Search with Qdrant, Sparse Embeddings & FastAPI",
                "category": "AI & Machine Learning",
                "author_id": "usr_aiswarya_001",
                "author_name": "M. L. S. V. Aiswarya",
                "author_role": "Senior Full Stack Developer",
                "excerpt": "A deep dive into combining dense neural embeddings with BM25 sparse vectors in Qdrant vector database for enterprise retrieval accuracy.",
                "content": "Dense semantic embeddings excel at understanding broad user queries, but they often struggle with specific domain acronyms, product serials, and precise syntax. In this deep architectural review, we build a hybrid retrieval system combining BGE-M3 dense vectors with BM25 sparse representations using Python FastAPI and Qdrant vector database...",
                "tags": ["AI", "RAG", "Vector Search", "Python", "FastAPI", "Qdrant"],
                "cover_image": "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=1200&auto=format&fit=crop&q=80",
                "reading_time": "7 min read",
                "views": 1840,
                "likes": 128,
                "status": "Published"
            },
            {
                "id": "post_dist_locks",
                "title": "Distributed Locking and Idempotency in High-Throughput Microservices",
                "category": "System Architecture",
                "author_id": "usr_aiswarya_001",
                "author_name": "M. L. S. V. Aiswarya",
                "author_role": "Senior Full Stack Developer",
                "excerpt": "Implementing robust idempotency keys, Redis Redlock algorithms, and PostgreSQL transaction isolation to prevent double charges.",
                "content": "In distributed microservices processing thousands of financial transactions per second, network retries and duplicate webhooks will inevitably occur. This article explores how to architect end-to-end idempotency using client-generated UUID keys, atomic Redis set-if-not-exists locks, and PostgreSQL row-level locks...",
                "tags": ["Distributed Systems", "PostgreSQL", "Redis", "Architecture", "Microservices"],
                "cover_image": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80",
                "reading_time": "9 min read",
                "views": 2420,
                "likes": 215,
                "status": "Published"
            },
            {
                "id": "post_react_opt",
                "title": "React 19 Server Components & Concurrent Mode Performance Optimization",
                "category": "React & Modern Web",
                "author_id": "usr_aiswarya_001",
                "author_name": "M. L. S. V. Aiswarya",
                "author_role": "Senior Full Stack Developer",
                "excerpt": "Practical techniques for reducing JavaScript bundle sizes by 60% and achieving sub-100ms INP metrics on heavy enterprise SPAs.",
                "content": "Modern client-side applications often degrade in responsiveness as third-party packages and state trees grow. We examine React 19's server components architecture, transition actions, useOptimistic primitives, and custom memoization hooks to maintain instantaneous user interactions...",
                "tags": ["React", "JavaScript", "Frontend", "Performance", "Web Development"],
                "cover_image": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&auto=format&fit=crop&q=80",
                "reading_time": "6 min read",
                "views": 1690,
                "likes": 142,
                "status": "Published"
            }
        ]
        for p in posts_data:
            if not db.query(Post).filter(Post.id == p["id"]).first():
                db.add(Post(**p))

        # 4. Seed Summits
        summits_data = [
            {
                "id": "summit_hyderabad_2026",
                "title": "TechTalk Summit Hyderabad 2026: AI & Cloud Systems",
                "slug": "hyderabad-ai-cloud-summit-2026",
                "subtitle": "South India's Premier Gathering of Engineers, Founders & AI Researchers",
                "badge": "FLAGSHIP ANNUAL SUMMIT",
                "description": "Join 1,000+ technology leaders, principal engineers, and startup founders for a full-day immersive summit covering Generative AI systems, distributed cloud architecture, and high-performance engineering.",
                "banner_image": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80",
                "date": "April 18, 2026",
                "time": "09:00 AM - 06:30 PM IST",
                "location": "Hyderabad, Telangana, India",
                "venue": "HICC - Hyderabad International Convention Centre",
                "address": "Novotel & HICC Complex, Near HITEC City, Hyderabad, Telangana 500081",
                "max_seats": 1000,
                "registered_count": 486,
                "status": "Upcoming",
                "agenda": [
                    {"time": "09:00 AM", "title": "Registration & Welcome Networking Breakfast"},
                    {"time": "10:00 AM", "title": "Keynote: The Next Decade of Autonomous AI Systems in Enterprise"},
                    {"time": "11:30 AM", "title": "Technical Deep Dive: Building Zero-Downtime Multi-Region Cloud Backends"},
                    {"time": "02:00 PM", "title": "Live Panel: Venture Capital & DeepTech Startup Scaling in 2026"},
                    {"time": "04:30 PM", "title": "Developer Hack Showcase & Closing Awards"}
                ],
                "speakers": [
                    {"name": "Dr. Raghavendra Rao", "title": "VP of AI Research", "company": "NexziByte Labs"},
                    {"name": "Ananya Sen", "title": "Distinguished Cloud Architect", "company": "Hyperscale Cloud"},
                    {"name": "Karthik Venkatesh", "title": "Founder & CEO", "company": "Veloce Systems"}
                ],
                "perks": ["Full Conference Access", "Speaker Q&A Lounge", "Networking Buffet Lunch", "Official TechTalk Delegate Kit", "Certificate of Participation"]
            },
            {
                "id": "summit_bengaluru_2026",
                "title": "TechTalk Bengaluru Summit: High-Throughput Distributed Systems",
                "slug": "bengaluru-distributed-systems-2026",
                "subtitle": "Mastering Microservices, Low-Latency Networking, and Database Sharding",
                "badge": "NATIONAL TECHNICAL SUMMIT",
                "description": "A focused technical conference tailored for senior developers, backend architects, and SREs running mission-critical workloads.",
                "banner_image": "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80",
                "date": "May 24, 2026",
                "time": "09:30 AM - 05:30 PM IST",
                "location": "Bengaluru, Karnataka, India",
                "venue": "Nimhans Convention Centre, Koramangala / Hosur Rd",
                "max_seats": 600,
                "registered_count": 210,
                "status": "Upcoming",
                "agenda": [
                    {"time": "09:30 AM", "title": "Keynote: Distributed Consensus with Raft in Practice"},
                    {"time": "11:00 AM", "title": "PostgreSQL at Scale: Sharding, Partitioning & Connection Pooling"},
                    {"time": "02:00 PM", "title": "Hands-on Workshop: Observability with OpenTelemetry and Grafana"}
                ]
            }
        ]
        for s in summits_data:
            if not db.query(Summit).filter(Summit.id == s["id"]).first():
                db.add(Summit(**s))

        # 5. Seed Founder Meets
        meets_data = [
            {
                "id": "meet_hyd_saas_2026",
                "title": "B2B SaaS Founder & Angel Investor Roundtable: Hyderabad",
                "slug": "hyderabad-saas-founder-roundtable-2026",
                "subtitle": "Exclusive 50-Person Closed-Door Discussion on GTM & Seed Funding",
                "badge": "FOUNDER ROUNDTABLE",
                "description": "An intimate, curated roundtable connecting early-stage SaaS founders, seed investors, and enterprise mentors to discuss go-to-market strategies, unit economics, and venture fundraising.",
                "banner_image": "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1200&auto=format&fit=crop&q=80",
                "date": "March 28, 2026",
                "time": "04:30 PM - 08:30 PM IST",
                "location": "Hyderabad, Telangana, India",
                "venue": "T-Hub Phase 2, Knowledge City, Madhapur",
                "address": "T-Hub Innovation Center, Plot No 1/C, Sy No 83/1, Raidurgam, Hyderabad 500081",
                "founder_info": "Curated for Seed to Series-A founders with live MRR / active enterprise pilots.",
                "max_seats": 50,
                "registered_count": 42,
                "status": "Upcoming",
                "agenda": [
                    {"time": "04:30 PM", "title": "Founder Check-in & High-Impact Introductions"},
                    {"time": "05:15 PM", "title": "Fireside Chat: From 0 to $1M ARR Without Burning Cash"},
                    {"time": "06:30 PM", "title": "Open Pitch Clinic with 5 Leading Angel Syndicates"},
                    {"time": "07:30 PM", "title": "Private Networking Dinner & 1-on-1 Investor Syncs"}
                ],
                "speakers": [
                    {"name": "Suresh Nambiar", "title": "Managing Partner", "company": "Venture Catalysts India"},
                    {"name": "Ritika Chopra", "title": "Co-founder & CRO", "company": "ScalePulse SaaS"}
                ]
            }
        ]
        for m in meets_data:
            if not db.query(FounderMeet).filter(FounderMeet.id == m["id"]).first():
                db.add(FounderMeet(**m))

        # 6. Seed Speakers
        speakers_data = [
            {
                "id": "spk_raghavendra",
                "name": "Dr. Raghavendra Rao",
                "title": "VP of AI Research & Generative Architectures",
                "company": "NexziByte Labs",
                "bio": "Over 15 years leading research teams in machine learning, transformer optimizations, and high-throughput vector indexing systems.",
                "expertise": ["LLM Architecture", "Sparse-Dense Vector Search", "Model Distillation", "GPU Clusters"],
                "image_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
                "is_featured": True
            },
            {
                "id": "spk_ananya",
                "name": "Ananya Sen",
                "title": "Distinguished Cloud Architect",
                "company": "Hyperscale Cloud",
                "bio": "Specializes in multi-region Kubernetes deployments, automated disaster recovery, and resilient zero-trust networking architectures.",
                "expertise": ["Kubernetes", "Distributed Consensus", "Cloud Security", "FinOps"],
                "image_url": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
                "is_featured": True
            },
            {
                "id": "spk_karthik",
                "name": "Karthik Venkatesh",
                "title": "Founder & CEO",
                "company": "Veloce Systems",
                "bio": "Serial entrepreneur having scaled developer tooling companies to over 100,000 active global engineers.",
                "expertise": ["Developer Tooling", "Bootstrapping to Scale", "Product Strategy", "Venture Capital"],
                "image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
                "is_featured": True
            }
        ]
        for sp in speakers_data:
            if not db.query(Speaker).filter(Speaker.id == sp["id"]).first():
                db.add(Speaker(**sp))

        # 7. No dummy passes seeded - only real user registrations will appear
        db.commit()
        logger.info("Database seeding completed successfully!")
        print("[SUCCESS] TechTalk PostgreSQL/SQLAlchemy Database Seed Completed!")

    except Exception as e:
        db.rollback()
        logger.error(f"Seeding error: {e}")
        print(f"Seed warning: {e}")
    finally:
        if owns_session:
            db.close()

if __name__ == "__main__":
    seed_database()
