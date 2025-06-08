# NestJS, PostgreSQL, Prisma Lab (with Docker)

A hands-on project demonstrating the integration of NestJS, PostgreSQL, and Prisma ORM within a Dockerized environment, built for educational purposes.

## 🌟 Goal: Education

This project aims to provide a clear example for learning:

*   Building APIs with **NestJS**.
*   Database management using **PostgreSQL**.
*   Object-Relational Mapping with **Prisma ORM**.
*   Containerizing applications and databases using **Docker**.
*   Integrating these technologies into a cohesive stack.

## ✨ Technologies Used

*   **NestJS:** A progressive Node.js framework for building efficient and scalable server-side applications.
*   **PostgreSQL:** A powerful, open-source relational database system.
*   **Prisma ORM:** A next-generation ORM for Node.js and TypeScript.
*   **Docker:** Platform for developing, shipping, and running applications in containers.
*   TypeScript: The primary language for NestJS.
*   Node.js: JavaScript runtime.

## ⚙️ Getting Started

### Prerequisites

Make sure you have Docker and Docker Compose installed.

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Borovskova/postgres-prisma-nest-practice.git
    ```

2.  **Build and start the Docker containers:**

    This will start the NestJS application and the PostgreSQL database.

    ```bash
      npm run start:dev
      docker compose up dev-db -d
      npx prisma migrate dev
      npx prisma generate
      npx prisma studio
    ```


### Running the Application

*   Access the API: `http://localhost:3000/` 
