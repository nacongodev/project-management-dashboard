from flask import Flask, request, jsonify
from flask_socketio import SocketIO
from crewai import Agent, Task, Crew, Process
from dotenv import load_dotenv
import os
from langchain.tools import Tool
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.memory import ConversationBufferMemory

load_dotenv()

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# Initialize the language model
llm = ChatOpenAI(
    model="gpt-4-turbo-preview",
    temperature=0.7
)

# Create agents with more specific roles and tools
software_engineer = Agent(
    name="Software Engineer",
    role="System Architect",
    goal="Design and maintain system architecture, create technical specifications, and provide expert guidance on software development",
    backstory="""Expert software architect with extensive experience in system design, 
    microservices architecture, and cloud-native applications. Specialized in creating 
    scalable and maintainable systems.""",
    allow_delegation=True,
    verbose=True,
    llm=llm
)

frontend_dev = Agent(
    name="Frontend Developer",
    role="UI/UX Expert",
    goal="Implement user interfaces, ensure responsive design, and optimize user experience",
    backstory="""Specialized in React, TypeScript, and modern frontend technologies. 
    Expert in creating intuitive and accessible user interfaces with a focus on 
    performance and user experience.""",
    allow_delegation=True,
    verbose=True,
    llm=llm
)

backend_dev = Agent(
    name="Backend Developer",
    role="API and Database Expert",
    goal="Develop robust APIs, manage data flow, and ensure system reliability",
    backstory="""Expert in backend development, database management, and API design. 
    Specialized in creating scalable and secure backend systems with focus on 
    performance and maintainability.""",
    allow_delegation=True,
    verbose=True,
    llm=llm
)

qa_tester = Agent(
    name="QA Tester",
    role="Quality Assurance Expert",
    goal="Ensure software quality through comprehensive testing and validation",
    backstory="""Experienced in test automation, quality assurance, and software testing 
    methodologies. Expert in identifying and preventing potential issues before they 
    reach production.""",
    allow_delegation=True,
    verbose=True,
    llm=llm
)

# Create tasks with more detailed descriptions
design_task = Task(
    description="""Create system architecture and technical specifications. 
    Consider scalability, maintainability, and best practices in software design.""",
    agent=software_engineer
)

frontend_task = Task(
    description="""Implement user interface components with focus on responsive design, 
    accessibility, and optimal user experience. Ensure cross-browser compatibility.""",
    agent=frontend_dev
)

backend_task = Task(
    description="""Develop API endpoints and database schema with emphasis on security, 
    performance, and scalability. Implement proper error handling and logging.""",
    agent=backend_dev
)

testing_task = Task(
    description="""Create and execute comprehensive test cases covering unit tests, 
    integration tests, and end-to-end testing. Ensure code quality and reliability.""",
    agent=qa_tester
)

# Create crew with sequential process
crew = Crew(
    agents=[software_engineer, frontend_dev, backend_dev, qa_tester],
    tasks=[design_task, frontend_task, backend_task, testing_task],
    process=Process.sequential
)

# Create conversation memory for each agent
agent_memories = {
    'Software Engineer': ConversationBufferMemory(memory_key="chat_history", return_messages=True),
    'Frontend Developer': ConversationBufferMemory(memory_key="chat_history", return_messages=True),
    'Backend Developer': ConversationBufferMemory(memory_key="chat_history", return_messages=True),
    'QA Tester': ConversationBufferMemory(memory_key="chat_history", return_messages=True)
}

@socketio.on('chat_message')
def handle_chat_message(data):
    try:
        role = data.get('role')
        message = data.get('message')
        
        # Get the appropriate agent based on role
        agent_map = {
            'Software Engineer': software_engineer,
            'Frontend Developer': frontend_dev,
            'Backend Developer': backend_dev,
            'QA Tester': qa_tester
        }
        
        agent = agent_map.get(role)
        if not agent:
            raise ValueError('Agent not found')
            
        # Get the agent's memory
        memory = agent_memories.get(role)
        
        # Create a prompt template for the conversation
        prompt = ChatPromptTemplate.from_messages([
            ("system", f"You are {role}. Respond to the following message in a helpful and professional manner."),
            MessagesPlaceholder(variable_name="chat_history"),
            ("human", "{input}")
        ])
        
        # Create an agent executor with memory
        agent_executor = AgentExecutor.from_agent_and_tools(
            agent=agent,
            tools=[],  # Add specific tools if needed
            memory=memory,
            verbose=True
        )
        
        # Process the message using the agent
        response = agent_executor.run(message)
        
        # Emit the response
        socketio.emit('chat_response', {
            'role': role,
            'response': response
        })
        
    except Exception as e:
        print(f"Error in handle_chat_message: {str(e)}")
        socketio.emit('error', {'message': str(e)})

@socketio.on('review_document')
def handle_document_review(document):
    try:
        # Execute the review task using the crew
        result = crew.execute_task(design_task)
        socketio.emit('review_complete', {
            'status': 'success',
            'feedback': result
        })
    except Exception as e:
        print(f"Error in handle_document_review: {str(e)}")
        socketio.emit('error', {'message': str(e)})

if __name__ == '__main__':
    port = int(os.getenv('PORT', 3000))
    print(f"Starting server on port {port}")
    socketio.run(app, port=port, debug=True)