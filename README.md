# AI-Powered-Smart-Emergency-Response-and-Mental-Wellness-Support-System
combines classical AI and modern LLMs. The system uses the A* search algorithm for optimal emergency routing over a graph-based state space and integrates Google Gemini API for context-aware mental health support. Built with Next.js, Prisma, and SQLite, it demonstrates intelligent agents, search algorithms, and NLP in a real-world application.



Clone the Repository ->

git clone https://github.com/sohamgosavi2006/AI-Powered-Smart-Emergency-Response-and-Mental-Wellness-Support-System.git

Run the Project ->

Step 1 -> Go to project folder : cd ai-project

Step 2 -> Install Dependencies :

a.) sudo npm install i : Use it is package.json exists and we need to just create node modules
b.) sudo npm init      : Use it when package.json NOT exist and we need to create new Node.js project

Step 3 -> Setup Prisma Database :
          a.) npx prisma generate
          b.) npx prisma db push

Step 4 -> Run the Application :
          npm run dev

Setup Environment Variables ->

a.) Create .env or .env.local file 

b.) Add -

DATABASE_URL="file:./dev.db"
GEMINI_API_KEY=your_api_key_here


Project Overview ->

AI-Powered Smart Emergency Response and Mental Wellness Support System is a full-stack artificial intelligence application designed to address two critical real-world challenges: delayed emergency response and lack of accessible mental health support. The system integrates classical AI techniques with modern AI technologies to provide intelligent, real-time assistance to users.

The application consists of two core modules: an Emergency Response System and a Mental Health Support System. The emergency module focuses on optimizing response time during critical situations by computing the shortest path to nearby emergency services such as hospitals, police stations, or fire stations. It models real-world locations as a graph-based state space, where nodes represent locations and edges represent connections between them. The system uses the A* (A-star) search algorithm, a heuristic-based pathfinding technique, to efficiently determine the optimal route based on path cost (distance or time). This ensures faster and more reliable emergency navigation.

The mental health module provides an intelligent conversational interface powered by Google Gemini API, a large language model (LLM). Unlike rule-based chatbots, this system understands natural language input, detects emotional context, and generates meaningful, supportive responses. It models user interaction as an abstract state space of emotional conditions such as stress, anxiety, or normal states, with the goal of guiding users toward a more stable mental state through AI-driven conversations.

The system is built using a modern full-stack architecture with Next.js, enabling both frontend and backend development within a single framework. The backend logic is handled through API routes, which process user inputs and coordinate between different components such as the A* algorithm and the Gemini API. The application uses Prisma ORM with SQLite as the database layer to manage and store relevant data efficiently. Sensitive configurations such as API keys are managed securely using environment variables.

This project demonstrates key artificial intelligence concepts including state space representation, search algorithms, intelligent agents, and natural language processing (NLP). By combining classical problem-solving techniques with advanced AI models, the system showcases a hybrid approach to building scalable and impactful AI solutions. It is designed to be extensible and can be further enhanced with real-time data, advanced analytics, or integration with external services.

Overall, the project highlights how AI can be applied to create practical systems that contribute to societal well-being by improving emergency response efficiency and providing accessible mental health support.


