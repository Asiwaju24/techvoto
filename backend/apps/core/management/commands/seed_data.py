"""
python manage.py seed_data

Populates the database with realistic sample data so every page
renders immediately without manual admin entry.

Safe to run multiple times — uses get_or_create throughout.
"""

from django.core.management.base import BaseCommand
from django.utils import timezone
from django.utils.text import slugify
import datetime


class Command(BaseCommand):
    help = 'Seed the database with sample data for all apps'

    def add_arguments(self, parser):
        parser.add_argument(
            '--reset', action='store_true',
            help='Delete existing data before seeding (destructive)'
        )

    def handle(self, *args, **options):
        if options['reset']:
            self.stdout.write(self.style.WARNING('Resetting data…'))
            self._reset()

        self.stdout.write('Seeding…')
        self._seed_users()
        self._seed_courses()
        self._seed_blog()
        self._seed_mentors()
        self._seed_certifications()
        self._seed_labs()
        self.stdout.write(self.style.SUCCESS('\n✅  Database seeded successfully!\n'))
        self.stdout.write('  Admin:    http://localhost:8000/admin/')
        self.stdout.write('  API docs: http://localhost:8000/api/docs/')
        self.stdout.write('  Login:    admin@techvoto.com / admin1234\n')

    # ─────────────────────────────────────────────────────
    def _reset(self):
        from apps.users.models import User
        from apps.courses.models import Category, Course, Lesson
        from apps.blog.models import Post, Tag
        from apps.mentorship.models import MentorProfile
        from apps.certifications.models import Certification
        from apps.labs.models import Lab

        Lab.objects.all().delete()
        Certification.objects.all().delete()
        MentorProfile.objects.all().delete()
        Post.objects.all().delete()
        Tag.objects.all().delete()
        Lesson.objects.all().delete()
        Course.objects.all().delete()
        Category.objects.all().delete()
        User.objects.filter(is_superuser=False).delete()
        self.stdout.write(self.style.WARNING('  Data cleared.'))

    # ─────────────────────────────────────────────────────
    def _seed_users(self):
        from apps.users.models import User

        # Superuser / admin
        if not User.objects.filter(email='admin@techvoto.com').exists():
            User.objects.create_superuser(
                email='admin@techvoto.com',
                password='admin1234',
                first_name='Admin',
                last_name='Techvoto',
            )
            self.stdout.write('  Created superuser: admin@techvoto.com / admin1234')

        # Sample learner accounts
        learners = [
            dict(email='amara@example.com',   first_name='Amara',     last_name='Levi',    plan='pro',   xp=3240, streak=12),
            dict(email='marcus@example.com',  first_name='Marcus',    last_name='King',    plan='free',  xp=820,  streak=4),
            dict(email='sophia@example.com',  first_name='Sophia',    last_name='Peters',  plan='pro',   xp=1550, streak=7),
            dict(email='tunde@example.com',   first_name='Tunde',     last_name='Ibrahim', plan='teams', xp=8900, streak=31),
            dict(email='adunola@example.com', first_name='Adunola',   last_name='Obi',     plan='pro',   xp=5100, streak=19),
        ]
        for data in learners:
            user, created = User.objects.get_or_create(
                email=data['email'],
                defaults={**data, 'is_active': True},
            )
            if created:
                user.set_password('password123')
                user.save()

        self.stdout.write(f'  Users: {User.objects.count()} total')

    # ─────────────────────────────────────────────────────
    def _seed_courses(self):
        from apps.courses.models import Category, Course, Lesson, Enrollment
        from apps.users.models import User

        # Categories
        cats_data = [
            ('Backend',   'backend',   '🐍'),
            ('Frontend',  'frontend',  '⚛️'),
            ('Cloud',     'cloud',     '☁️'),
            ('DevOps',    'devops',    '🐳'),
            ('Data & AI', 'data-ai',   '🤖'),
            ('Security',  'security',  '🔐'),
        ]
        cats = {}
        for name, slug, icon in cats_data:
            cat, _ = Category.objects.get_or_create(slug=slug, defaults={'name': name, 'icon': icon})
            cats[slug] = cat

        # Courses
        courses_data = [
            dict(title='Python for Beginners',            slug='python-beginners',      cat='backend',  level='beginner',     price='free', emoji='🐍', hours=12, lessons=24,
                 desc='Learn Python from zero with real projects. Perfect for absolute beginners starting their coding journey.'),
            dict(title='React.js Complete Course',         slug='react-complete',        cat='frontend', level='intermediate', price='pro',  emoji='⚛️', hours=20, lessons=40,
                 desc='Build modern UIs with React, hooks, React Router, and state management. Deploy your apps to Vercel.'),
            dict(title='Django REST API Masterclass',      slug='django-rest-api',       cat='backend',  level='intermediate', price='pro',  emoji='🐘', hours=18, lessons=36,
                 desc='Build scalable REST APIs with Django, JWT authentication, PostgreSQL, and auto-generated Swagger docs.'),
            dict(title='AWS Cloud Practitioner',           slug='aws-cloud-practitioner',cat='cloud',    level='beginner',     price='pro',  emoji='☁️', hours=15, lessons=30,
                 desc='Pass the AWS CLF-C02 certification exam and launch your cloud career with confidence.'),
            dict(title='Machine Learning with Python',     slug='machine-learning-python',cat='data-ai', level='intermediate', price='pro',  emoji='🤖', hours=25, lessons=50,
                 desc='Linear regression, neural networks, scikit-learn, and real ML projects from scratch.'),
            dict(title='Docker & Kubernetes',              slug='docker-kubernetes',     cat='devops',   level='advanced',     price='pro',  emoji='🐳', hours=16, lessons=32,
                 desc='Containerise apps and orchestrate them at scale with Kubernetes. CI/CD pipelines included.'),
            dict(title='SQL & PostgreSQL Bootcamp',        slug='sql-postgresql',        cat='backend',  level='beginner',     price='free', emoji='🗃️', hours=10, lessons=20,
                 desc='Master relational databases, complex queries, indexing, and query optimisation with PostgreSQL.'),
            dict(title='Web Security Fundamentals',        slug='web-security',          cat='security', level='intermediate', price='pro',  emoji='🔐', hours=12, lessons=24,
                 desc='OWASP Top 10, authentication flaws, CORS, XSS, SQL injection, and how to prevent them.'),
            dict(title='Tailwind CSS Mastery',             slug='tailwind-css',          cat='frontend', level='beginner',     price='free', emoji='🎨', hours=8,  lessons=16,
                 desc='Build beautiful, responsive UIs fast using Tailwind CSS utility classes. No design skills needed.'),
            dict(title='Node.js & Express API',            slug='nodejs-express',        cat='backend',  level='intermediate', price='pro',  emoji='🟢', hours=14, lessons=28,
                 desc='Build production-ready REST APIs with Node.js, Express, MongoDB, and JWT authentication.'),
            dict(title='Data Analysis with Pandas',        slug='pandas-data-analysis',  cat='data-ai',  level='beginner',     price='free', emoji='🐼', hours=10, lessons=20,
                 desc='Load, clean, analyse, and visualise data using pandas, numpy, and matplotlib in Python.'),
            dict(title='Kubernetes for Engineers',         slug='kubernetes-engineers',  cat='devops',   level='advanced',     price='pro',  emoji='⚙️', hours=20, lessons=40,
                 desc='Production Kubernetes: networking, storage, security, autoscaling, Helm charts, and GitOps.'),
        ]

        sample_lessons = [
            'Introduction & Setup',
            'Core Concepts',
            'Working with Data',
            'Building Your First Project',
            'Authentication & Security',
            'Testing',
            'Deployment',
            'Advanced Patterns',
        ]

        for c in courses_data:
            course, created = Course.objects.get_or_create(
                slug=c['slug'],
                defaults=dict(
                    title=c['title'],
                    description=c['desc'],
                    category=cats[c['cat']],
                    level=c['level'],
                    price_tier=c['price'],
                    emoji=c['emoji'],
                    duration_hours=c['hours'],
                    total_lessons=c['lessons'],
                    is_published=True,
                ),
            )
            if created:
                # Add sample lessons
                for i, lesson_title in enumerate(sample_lessons):
                    Lesson.objects.create(
                        course=course,
                        title=lesson_title,
                        order=i + 1,
                        duration_minutes=30 + (i * 10),
                        is_free_preview=(i < 2),
                        content=f'Lesson content for {lesson_title} in {course.title}.',
                    )

        # Enrol some learners in courses
        learner_emails = ['amara@example.com', 'marcus@example.com', 'sophia@example.com']
        enrolment_data = [
            ('amara@example.com',  'python-beginners',      82),
            ('amara@example.com',  'react-complete',        65),
            ('amara@example.com',  'django-rest-api',       48),
            ('marcus@example.com', 'python-beginners',      30),
            ('marcus@example.com', 'sql-postgresql',        15),
            ('sophia@example.com', 'machine-learning-python', 55),
            ('sophia@example.com', 'pandas-data-analysis',  90),
        ]
        for email, slug, pct in enrolment_data:
            try:
                user   = User.objects.get(email=email)
                course = Course.objects.get(slug=slug)
                Enrollment.objects.get_or_create(
                    user=user, course=course,
                    defaults={'progress_pct': pct},
                )
            except (User.DoesNotExist, Course.DoesNotExist):
                pass

        self.stdout.write(f'  Courses: {Course.objects.count()} published, {Enrollment.objects.count()} enrolments')

    # ─────────────────────────────────────────────────────
    def _seed_blog(self):
        from apps.blog.models import Tag, Post
        from apps.users.models import User

        admin = User.objects.filter(is_superuser=True).first()

        tags_data = [
            ('AI/ML',    'ai-ml'),
            ('Cloud',    'cloud'),
            ('Frontend', 'frontend'),
            ('Backend',  'backend'),
            ('DevOps',   'devops'),
            ('Career',   'career'),
            ('Security', 'security'),
        ]
        tags = {}
        for name, slug in tags_data:
            tag, _ = Tag.objects.get_or_create(slug=slug, defaults={'name': name})
            tags[slug] = tag

        posts_data = [
            dict(
                title='How to Break Into AI Engineering in 2025',
                slug='break-into-ai-engineering-2025',
                excerpt='A practical roadmap from zero to your first ML engineering role — no PhD required.',
                content='''Getting into AI engineering feels daunting, but the path is clearer than you think.

## Step 1: Master Python First
Before anything else, you need strong Python fundamentals. NumPy, pandas, and matplotlib should feel natural.

## Step 2: Learn the Math That Matters
You don't need a PhD, but you do need linear algebra, calculus, and basic statistics. Khan Academy and 3Blue1Brown are free and excellent.

## Step 3: Pick a Framework and Go Deep
Start with scikit-learn for classical ML, then move to PyTorch or TensorFlow for deep learning. Build real projects, not just tutorials.

## Step 4: Build a Portfolio
A GitHub repo with 3–5 real projects beats a resume full of buzzwords. Deploy at least one model as an API.

## Step 5: Learn MLOps Basics
Companies hire engineers who can deploy and monitor models, not just build them. Learn Docker, FastAPI, and basic cloud deployment.

The journey takes 12–18 months of consistent effort. Start today.''',
                tags=['ai-ml', 'career'],
                emoji='🤖',
                read_time=8,
                featured=True,
            ),
            dict(
                title='AWS vs GCP vs Azure: Which Should You Learn First?',
                slug='aws-vs-gcp-vs-azure',
                excerpt='A no-fluff comparison for developers deciding where to start their cloud journey.',
                content='''The cloud wars are real, but for a developer starting out, the choice is simpler than the marketing suggests.

## AWS: The Safe Bet
AWS has the largest market share, the most job postings, and the deepest ecosystem. If you want maximum employability, start here. The AWS Cloud Practitioner cert is a solid first credential.

## GCP: The Developer's Cloud  
Google Cloud is developer-friendly with excellent Kubernetes tooling (they created it). If you're going deep on data engineering or ML, GCP's BigQuery and Vertex AI are best-in-class.

## Azure: The Enterprise Play
Azure dominates enterprise customers, especially those already on Microsoft products. If you're targeting large corporate employers, Azure skills command premium salaries.

**Bottom line:** Start with AWS for job opportunities, GCP if you're ML-focused, Azure if you're targeting enterprise. You'll pick up the others naturally once you understand cloud fundamentals.''',
                tags=['cloud', 'career'],
                emoji='☁️',
                read_time=6,
                featured=False,
            ),
            dict(
                title='React Server Components — What You Actually Need to Know',
                slug='react-server-components-explained',
                excerpt='Cutting through the hype to explain what RSC means for your day-to-day React work.',
                content='''React Server Components landed with a lot of fanfare. Here's what actually matters.

## What They Are
RSCs render on the server and send HTML to the client. No JavaScript bundle, no hydration overhead. They can directly access databases, file systems, and APIs.

## What They're Not
They don't replace client components. You still need client components for anything interactive — forms, click handlers, browser APIs, useState.

## The Mental Model
Think of it as a tree. Server components form the skeleton — they fetch data, render static structure. Client components are the interactive leaves.

## When to Use Them
- Data fetching that happens once on page load
- Static content that never changes per user interaction  
- Heavy libraries you don't want in the client bundle

## When Not To Use Them
- Form inputs, buttons, any interactivity
- useEffect, useState, browser-only APIs
- Anything that needs to re-render on the client

If you're using Next.js 14+, you're already using RSCs. The `"use client"` directive is your boundary marker.''',
                tags=['frontend'],
                emoji='⚛️',
                read_time=5,
                featured=False,
            ),
            dict(
                title='Docker in 10 Minutes: The Only Guide You Need',
                slug='docker-10-minutes',
                excerpt='Stop being intimidated by containers. Here\'s Docker explained simply with working examples.',
                content='''Docker confused me for months until one analogy clicked: it's a shipping container for your code.

## The Problem Docker Solves
"It works on my machine" is a running joke in software. Docker kills that problem by packaging your app and everything it needs into one portable unit.

## Core Concepts in Plain English
- **Image** — a recipe for building a container
- **Container** — a running instance of that recipe  
- **Dockerfile** — instructions to build an image
- **docker-compose** — run multiple containers together

## A Real Example
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
```

That's it. `docker build -t myapp .` then `docker run -p 8000:8000 myapp`.

## Why It Matters for Your Career
Kubernetes (the industry-standard way to run containers at scale) only makes sense once you understand Docker. Every DevOps, backend, and platform engineering role expects Docker fluency.''',
                tags=['devops'],
                emoji='🐳',
                read_time=10,
                featured=False,
            ),
            dict(
                title='The 5 Security Mistakes Every Junior Dev Makes',
                slug='security-mistakes-junior-devs',
                excerpt='From SQL injection to broken auth — these are the vulnerabilities you need to stop writing today.',
                content='''Security isn't a feature you add at the end. Here are the mistakes I see most often in code reviews.

## 1. Storing Passwords in Plain Text
Never. Always hash with bcrypt, Argon2, or PBKDF2. Django's `make_password` does this for you.

## 2. SQL Injection via String Concatenation
```python
# WRONG — never do this
query = f"SELECT * FROM users WHERE email = '{user_input}'"

# RIGHT — use parameterised queries
cursor.execute("SELECT * FROM users WHERE email = %s", [user_input])
```

## 3. Exposing Stack Traces in Production
`DEBUG=True` in production shows your entire codebase to anyone who triggers an error. Turn it off.

## 4. No Rate Limiting on Auth Endpoints
Without rate limiting, your login endpoint is an open invitation for brute force attacks. Add throttling.

## 5. Trusting Client-Side Validation Only
Never. Validate everything on the server. Always. Client-side validation is UX, not security.''',
                tags=['security', 'backend'],
                emoji='🔐',
                read_time=7,
                featured=False,
            ),
            dict(
                title='Tech Salaries in Nigeria 2025 — The Real Data',
                slug='tech-salaries-nigeria-2025',
                excerpt='We surveyed developers across Lagos, Abuja, and Port Harcourt. Here\'s what they earn.',
                content='''The tech salary landscape in Nigeria has shifted dramatically in the last three years. Remote-first hiring from global companies changed everything.

## Junior Developer (0–2 years)
- Local companies: ₦300k–₦600k/month
- Remote international: $1,500–$3,000/month

## Mid-Level Developer (2–5 years)  
- Local companies: ₦700k–₦1.5m/month
- Remote international: $4,000–$7,000/month

## Senior Developer (5+ years)
- Local companies: ₦1.5m–₦3m/month  
- Remote international: $8,000–$15,000/month

## Highest-Paying Skills
1. Machine Learning / AI Engineering
2. Cloud Architecture (AWS/GCP certified)
3. Mobile (React Native, Flutter)
4. DevOps / Platform Engineering

## How to Access International Salaries
Toptal, Arc.dev, Remote OK, and direct applications to companies with global hiring. A strong portfolio and GitHub profile are worth more than a degree.''',
                tags=['career'],
                emoji='💰',
                read_time=6,
                featured=False,
            ),
        ]

        for p in posts_data:
            post, created = Post.objects.get_or_create(
                slug=p['slug'],
                defaults=dict(
                    title=p['title'],
                    author=admin,
                    excerpt=p['excerpt'],
                    content=p['content'],
                    emoji=p['emoji'],
                    read_time=p['read_time'],
                    is_published=True,
                    is_featured=p['featured'],
                    published_at=timezone.now() - datetime.timedelta(days=posts_data.index(p) * 3),
                ),
            )
            if created:
                for tag_slug in p['tags']:
                    post.tags.add(tags[tag_slug])

        self.stdout.write(f'  Blog: {Post.objects.count()} posts, {Tag.objects.count()} tags')

    # ─────────────────────────────────────────────────────
    def _seed_mentors(self):
        from apps.users.models import User
        from apps.mentorship.models import MentorProfile

        mentors_data = [
            dict(
                email='tunde.ibrahim@mentor.com',
                first_name='Tunde', last_name='Ibrahim',
                plan='pro', xp=15000,
                profile=dict(
                    title='Staff Engineer',
                    company='Google',
                    bio='10 years at Google across Search and Cloud infra. Helped 80+ engineers get promoted to senior and staff levels. Specialises in SWE interview prep, system design, and career strategy for engineers in Africa.',
                    tags=['System Design', 'Cloud', 'Career', 'Interviews'],
                    slots_per_month=4,
                    is_available=True,
                    availability_note='✅ Available this week',
                    requires_pro=True,
                ),
            ),
            dict(
                email='adunola.obi@mentor.com',
                first_name='Adunola', last_name='Obi',
                plan='pro', xp=12000,
                profile=dict(
                    title='Senior Data Scientist',
                    company='Spotify',
                    bio='Ex-McKinsey analyst turned data scientist. Expert at helping career switchers break into data science without a CS degree. Built recommendation models used by 400M+ listeners.',
                    tags=['AI/ML', 'Python', 'Data Science', 'Career Switch'],
                    slots_per_month=4,
                    is_available=True,
                    availability_note='✅ 3 slots left',
                    requires_pro=True,
                ),
            ),
            dict(
                email='kemi.adeyemi@mentor.com',
                first_name='Kemi', last_name='Adeyemi',
                plan='pro', xp=18000,
                profile=dict(
                    title='VP Engineering',
                    company='Stripe',
                    bio='Built and scaled 4 engineering teams from 0 to 50+ across 3 continents. Specialist in the manager track: from senior IC to EM and beyond. Obsessed with engineering culture.',
                    tags=['Leadership', 'Engineering Management', 'DevOps', 'Career'],
                    slots_per_month=2,
                    is_available=False,
                    availability_note='⏰ Booking for next month',
                    requires_pro=True,
                ),
            ),
            dict(
                email='bayo.okafor@mentor.com',
                first_name='Babatunde', last_name='Okafor',
                plan='pro', xp=11000,
                profile=dict(
                    title='Principal Cloud Architect',
                    company='AWS',
                    bio='15 AWS certifications including 5 Professional and Specialty. Helps engineers pass AWS exams on their first attempt. Focus on real-world cloud architecture patterns for African startups.',
                    tags=['AWS', 'DevOps', 'IaC', 'Cloud Architecture'],
                    slots_per_month=6,
                    is_available=True,
                    availability_note='✅ Available now',
                    requires_pro=False,
                ),
            ),
            dict(
                email='fatima.hassan@mentor.com',
                first_name='Fatima', last_name='Hassan',
                plan='pro', xp=9500,
                profile=dict(
                    title='Senior Frontend Engineer',
                    company='Vercel',
                    bio='Core contributor to Next.js documentation. Specialises in React performance optimisation, accessibility, and helping junior developers become strong frontend engineers.',
                    tags=['React', 'Next.js', 'TypeScript', 'Frontend'],
                    slots_per_month=4,
                    is_available=True,
                    availability_note='✅ 2 slots left this week',
                    requires_pro=False,
                ),
            ),
        ]

        for m in mentors_data:
            user, created = User.objects.get_or_create(
                email=m['email'],
                defaults=dict(
                    first_name=m['first_name'],
                    last_name=m['last_name'],
                    plan=m['plan'],
                    xp=m['xp'],
                    is_active=True,
                ),
            )
            if created:
                user.set_password('password123')
                user.save()

            MentorProfile.objects.get_or_create(
                user=user,
                defaults=m['profile'],
            )

        self.stdout.write(f'  Mentors: {MentorProfile.objects.count()} profiles')

    # ─────────────────────────────────────────────────────
    def _seed_certifications(self):
        from apps.certifications.models import Certification

        certs_data = [
            dict(name='Certified Cloud Architect',    slug='cloud-architect',    emoji='☁️',  level='advanced',     hours_min=40, hours_max=60,
                 desc='Multi-cloud design, IaC, and enterprise architecture across AWS, GCP, and Azure.'),
            dict(name='DevOps Professional',           slug='devops-professional', emoji='⚙️',  level='intermediate', hours_min=30, hours_max=45,
                 desc='CI/CD pipelines, Kubernetes, observability, SRE practices, and production incident response.'),
            dict(name='AI/ML Engineer',                slug='ai-ml-engineer',     emoji='🤖',  level='advanced',     hours_min=50, hours_max=70,
                 desc='ML fundamentals, deep learning, NLP, LLMs, and production MLOps deployment pipelines.'),
            dict(name='Data Science Associate',        slug='data-science',       emoji='🐍',  level='beginner',     hours_min=20, hours_max=30,
                 desc='Python, pandas, SQL, statistics, data visualisation, and machine learning fundamentals.'),
            dict(name='Cybersecurity Analyst',         slug='cybersecurity',      emoji='🔒',  level='advanced',     hours_min=35, hours_max=50,
                 desc='Threat detection, penetration testing, SIEM tools, and incident response protocols.'),
            dict(name='Full-Stack Developer',          slug='fullstack-developer', emoji='⚛️', level='intermediate', hours_min=45, hours_max=60,
                 desc='React, Django, databases, APIs, authentication, and full deployment workflows.'),
            dict(name='Cloud Practitioner',            slug='cloud-practitioner', emoji='🌤️',  level='beginner',     hours_min=10, hours_max=20,
                 desc='Cloud fundamentals, core AWS services, pricing models, and your first cloud certification.'),
            dict(name='Backend Engineering',           slug='backend-engineering',emoji='🐘',  level='intermediate', hours_min=35, hours_max=50,
                 desc='REST APIs, databases, caching, queues, and production backend architecture patterns.'),
        ]

        for c in certs_data:
            Certification.objects.get_or_create(
                slug=c['slug'],
                defaults=dict(
                    name=c['name'],
                    description=c['desc'],
                    emoji=c['emoji'],
                    level=c['level'],
                    hours_min=c['hours_min'],
                    hours_max=c['hours_max'],
                    is_active=True,
                ),
            )

        self.stdout.write(f'  Certifications: {Certification.objects.count()}')

    # ─────────────────────────────────────────────────────
    def _seed_labs(self):
        from apps.labs.models import Lab

        labs_data = [
            dict(name='Deploy a 3-Tier AWS App',         slug='aws-3-tier',          emoji='☁️',  level='intermediate', hours=3.0, pro=False,
                 desc='EC2, RDS, ALB, and S3. Full VPC with public/private subnets. Auto Scaling Group with CloudWatch alarms.'),
            dict(name='Kubernetes Blue-Green Deploy',     slug='k8s-blue-green',      emoji='🚢',  level='advanced',     hours=4.0, pro=True,
                 desc='Zero-downtime deployments on EKS. Configure Ingress, HPA, and rollback strategies with Helm charts.'),
            dict(name='Build a RAG Chatbot',              slug='rag-chatbot',          emoji='🤖',  level='advanced',     hours=5.0, pro=True,
                 desc='LangChain + OpenAI + Pinecone. Ingest documents, create embeddings, and build a production chatbot API.'),
            dict(name='Django REST API from Scratch',     slug='django-rest-scratch',  emoji='🐘',  level='intermediate', hours=3.0, pro=False,
                 desc='Build a full JWT-authenticated REST API with Django, PostgreSQL, and auto-generated Swagger docs.'),
            dict(name='React + Django Full Stack',        slug='react-django-fullstack',emoji='⚛️', level='intermediate', hours=4.0, pro=False,
                 desc='Connect a React frontend to a Django backend with auth, CRUD operations, and Cloudinary file uploads.'),
            dict(name='ML Pipeline with scikit-learn',   slug='ml-pipeline',          emoji='📊',  level='beginner',     hours=3.0, pro=False,
                 desc='Data preprocessing, feature engineering, model training, hyperparameter tuning, and deployment.'),
            dict(name='Terraform Infrastructure as Code', slug='terraform-iac',        emoji='🏗️',  level='advanced',     hours=5.0, pro=True,
                 desc='Define, provision, and manage AWS infrastructure using Terraform. Modules, state management, and CI/CD.'),
            dict(name='Docker Compose Full Stack',        slug='docker-compose-full',  emoji='🐳',  level='beginner',     hours=2.0, pro=False,
                 desc='Containerise a multi-service application with Docker Compose. Postgres, Redis, and Nginx included.'),
            dict(name='Secure a Node.js API',             slug='secure-nodejs-api',    emoji='🔐',  level='intermediate', hours=3.0, pro=False,
                 desc='Add rate limiting, JWT auth, input validation, helmet headers, and SQL injection protection.'),
        ]

        for l in labs_data:
            Lab.objects.get_or_create(
                slug=l['slug'],
                defaults=dict(
                    title=l['name'],
                    description=l['desc'],
                    emoji=l['emoji'],
                    level=l['level'],
                    estimated_hours=l['hours'],
                    requires_pro=l['pro'],
                    is_active=True,
                ),
            )

        self.stdout.write(f'  Labs: {Lab.objects.count()}')
