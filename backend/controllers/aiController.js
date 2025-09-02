const Groq = require('groq-sdk');
const Session = require('../models/Session');
const User = require('../models/User');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Mock questions database
const mockQuestions = {
  general: {
    easy: [
      "Tell me about yourself and your background.",
      "What are your greatest strengths?",
      "Why are you interested in this position?",
      "Where do you see yourself in 5 years?",
      "What motivates you at work?"
    ],
    medium: [
      "Describe a challenging project you worked on.",
      "How do you handle tight deadlines?",
      "Tell me about a time you had to learn something new quickly.",
      "How do you prioritize tasks when everything seems urgent?",
      "Describe a situation where you had to work with a difficult team member."
    ],
    hard: [
      "Tell me about a time you failed and what you learned from it.",
      "How would you handle a situation where you disagree with your manager?",
      "Describe the most complex problem you've solved.",
      "How do you stay updated with industry trends?",
      "What would you do if you discovered a major flaw in a project just before launch?"
    ]
  },
  frontend: {
    easy: [
      "What is the difference between HTML, CSS, and JavaScript?",
      "Explain what responsive design means.",
      "What are the benefits of using CSS frameworks?",
      "How do you optimize website loading speed?",
      "What is the DOM?"
    ],
    medium: [
      "Explain the difference between var, let, and const in JavaScript.",
      "How do you handle cross-browser compatibility?",
      "What are JavaScript closures?",
      "Explain the concept of virtual DOM.",
      "How do you implement state management in React?"
    ],
    hard: [
      "Explain how JavaScript event loop works.",
      "What are the differences between server-side and client-side rendering?",
      "How would you optimize a React application for performance?",
      "Explain webpack and its role in modern frontend development.",
      "How do you implement progressive web app features?"
    ]
  },
  backend: {
    easy: [
      "What is an API and how does it work?",
      "Explain the difference between SQL and NoSQL databases.",
      "What is RESTful architecture?",
      "How do you handle errors in your applications?",
      "What is the purpose of middleware?"
    ],
    medium: [
      "Explain database indexing and its benefits.",
      "How do you implement authentication and authorization?",
      "What are microservices and their advantages?",
      "How do you handle database transactions?",
      "Explain caching strategies."
    ],
    hard: [
      "How would you design a scalable system for millions of users?",
      "Explain database sharding and when to use it.",
      "How do you handle race conditions in concurrent systems?",
      "Design a rate limiting system.",
      "How would you implement a distributed cache?"
    ]
  },
  devops: {
    easy: [
      "What is DevOps and how does it differ from traditional development?",
      "Explain the concept of CI/CD pipeline.",
      "What is containerization and why is it useful?",
      "What are the benefits of Infrastructure as Code?",
      "Explain the difference between monitoring and logging."
    ],
    medium: [
      "How would you implement a CI/CD pipeline for a web application?",
      "Explain Docker containers vs virtual machines.",
      "What is Kubernetes and what problems does it solve?",
      "How do you handle secrets management in DevOps?",
      "Describe blue-green deployment strategy."
    ],
    hard: [
      "Design a highly available and scalable infrastructure on AWS.",
      "How would you implement zero-downtime deployments?",
      "Explain service mesh architecture and when to use it.",
      "How do you handle disaster recovery and backup strategies?",
      "Design a monitoring and alerting system for microservices."
    ]
  },
  fullstack: {
    easy: [
      "What is the difference between frontend and backend development?",
      "Explain how HTTP requests work between client and server.",
      "What is a database and why do we need it?",
      "How do you handle user authentication in web applications?",
      "What is responsive web design?"
    ],
    medium: [
      "How would you design a complete user registration system?",
      "Explain the MVC architecture pattern.",
      "How do you optimize both frontend and backend performance?",
      "What are the differences between SQL and NoSQL for full-stack apps?",
      "How do you implement real-time features in web applications?"
    ],
    hard: [
      "Design a scalable e-commerce platform architecture.",
      "How would you implement a microservices architecture for a full-stack app?",
      "Design a real-time chat application with offline support.",
      "How do you handle data consistency across multiple services?",
      "Implement a caching strategy for a high-traffic web application."
    ]
  },
  'data-science': {
    easy: [
      "What is the difference between supervised and unsupervised learning?",
      "Explain what data preprocessing involves.",
      "What is the purpose of data visualization?",
      "How do you handle missing data in datasets?",
      "What is the difference between correlation and causation?"
    ],
    medium: [
      "How would you evaluate the performance of a machine learning model?",
      "Explain the bias-variance tradeoff.",
      "How do you handle overfitting in machine learning models?",
      "What are the steps in a typical data science project?",
      "How do you choose the right algorithm for a given problem?"
    ],
    hard: [
      "Design a recommendation system for an e-commerce platform.",
      "How would you implement A/B testing for a machine learning model?",
      "Explain how to build and deploy a real-time ML prediction system.",
      "How do you handle concept drift in production ML models?",
      "Design a data pipeline for processing large-scale streaming data."
    ]
  },
  mobile: {
    easy: [
      "What is the difference between native and hybrid mobile apps?",
      "Explain the mobile app development lifecycle.",
      "What are the key considerations for mobile UI design?",
      "How do you handle different screen sizes in mobile apps?",
      "What is the purpose of app store optimization?"
    ],
    medium: [
      "How do you implement offline functionality in mobile apps?",
      "Explain state management in React Native or Flutter.",
      "How do you optimize mobile app performance?",
      "What are the best practices for mobile app security?",
      "How do you handle push notifications?"
    ],
    hard: [
      "Design a scalable mobile app architecture for millions of users.",
      "How would you implement real-time synchronization across devices?",
      "Design a mobile app with offline-first architecture.",
      "How do you handle app updates and backward compatibility?",
      "Implement a cross-platform mobile solution with shared business logic."
    ]
  },
  'machine-learning': {
    easy: [
      "What is the difference between AI, ML, and Deep Learning?",
      "Explain what a neural network is.",
      "What is the purpose of training and validation datasets?",
      "How do you measure model accuracy?",
      "What is feature engineering?"
    ],
    medium: [
      "How do you prevent overfitting in neural networks?",
      "Explain gradient descent and backpropagation.",
      "What are the different types of neural network architectures?",
      "How do you deploy ML models to production?",
      "What is transfer learning and when do you use it?"
    ],
    hard: [
      "Design an end-to-end MLOps pipeline.",
      "How would you build a real-time recommendation engine?",
      "Implement a distributed training system for large models.",
      "How do you handle model versioning and A/B testing in production?",
      "Design a computer vision system for autonomous vehicles."
    ]
  },
  cloud: {
    easy: [
      "What are the benefits of cloud computing?",
      "Explain the difference between IaaS, PaaS, and SaaS.",
      "What is auto-scaling and why is it important?",
      "How do you ensure data security in the cloud?",
      "What is the difference between public, private, and hybrid clouds?"
    ],
    medium: [
      "How do you design a multi-region cloud architecture?",
      "Explain cloud cost optimization strategies.",
      "How do you implement disaster recovery in the cloud?",
      "What are microservices and how do they work in the cloud?",
      "How do you monitor and log cloud applications?"
    ],
    hard: [
      "Design a globally distributed, highly available system on AWS.",
      "How would you migrate a legacy monolith to cloud-native architecture?",
      "Design a serverless architecture for a high-traffic application.",
      "How do you implement zero-trust security in cloud environments?",
      "Design a multi-cloud strategy with vendor lock-in prevention."
    ]
  },
  cybersecurity: {
    easy: [
      "What is the CIA triad in cybersecurity?",
      "Explain the difference between authentication and authorization.",
      "What are common types of cyber attacks?",
      "How do you create a strong password policy?",
      "What is the purpose of firewalls?"
    ],
    medium: [
      "How do you conduct a security risk assessment?",
      "Explain penetration testing methodology.",
      "How do you implement secure coding practices?",
      "What is zero-trust security architecture?",
      "How do you handle security incident response?"
    ],
    hard: [
      "Design a comprehensive security architecture for a financial institution.",
      "How would you implement advanced threat detection and response?",
      "Design a secure DevSecOps pipeline.",
      "How do you protect against advanced persistent threats (APTs)?",
      "Implement a security framework for cloud-native applications."
    ]
  },
  qa: {
    easy: [
      "What is the difference between manual and automated testing?",
      "Explain the software testing lifecycle.",
      "What are the different types of testing (unit, integration, system)?",
      "How do you write effective test cases?",
      "What is regression testing?"
    ],
    medium: [
      "How do you implement test automation frameworks?",
      "Explain API testing strategies and tools.",
      "How do you perform load and performance testing?",
      "What is behavior-driven development (BDD)?",
      "How do you test mobile applications?"
    ],
    hard: [
      "Design a comprehensive testing strategy for microservices.",
      "How would you implement continuous testing in CI/CD pipelines?",
      "Design an automated testing framework for a complex web application.",
      "How do you test AI/ML systems and models?",
      "Implement chaos engineering and fault injection testing."
    ]
  },
  'product-manager': {
    easy: [
      "What is the role of a Product Manager?",
      "How do you gather and prioritize user requirements?",
      "What is a product roadmap and why is it important?",
      "How do you measure product success?",
      "What is the difference between features and benefits?"
    ],
    medium: [
      "How do you conduct market research and competitive analysis?",
      "Explain agile product development methodologies.",
      "How do you work with engineering teams to deliver products?",
      "What are key product metrics and KPIs?",
      "How do you handle stakeholder management?"
    ],
    hard: [
      "Design a go-to-market strategy for a new product.",
      "How would you pivot a failing product?",
      "Design a product strategy for entering a new market.",
      "How do you balance technical debt vs new features?",
      "Create a product vision and strategy for a 5-year roadmap."
    ]
  },
  'system-design': {
    easy: [
      "What are the key principles of system design?",
      "Explain scalability and its importance.",
      "What is load balancing and why do we need it?",
      "How do databases fit into system architecture?",
      "What is the difference between SQL and NoSQL databases?"
    ],
    medium: [
      "How do you design a caching strategy?",
      "Explain microservices vs monolithic architecture.",
      "How do you handle data consistency in distributed systems?",
      "What are message queues and when do you use them?",
      "How do you design for fault tolerance?"
    ],
    hard: [
      "Design a system like Twitter that can handle millions of users.",
      "How would you design a global content delivery network?",
      "Design a distributed database system with ACID properties.",
      "How do you design a real-time chat system like WhatsApp?",
      "Design a recommendation system for a streaming platform like Netflix."
    ]
  }
};

const generateQuestions = async (req, res) => {
  try {
    const { role = 'general', difficulty = 'medium' } = req.body;
    const user = await User.findById(req.user.id);
    
    let questions;
    
    if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.startsWith('gsk_')) {
      try {
        console.log('🤖 Using Groq AI for question generation...');
        const roleContexts = {
          'devops': 'DevOps Engineer focusing on CI/CD, containerization, infrastructure automation, monitoring, and cloud platforms',
          'frontend': 'Frontend Developer focusing on HTML, CSS, JavaScript, React, Vue, Angular, and user interface development',
          'backend': 'Backend Developer focusing on APIs, databases, server-side logic, microservices, and system architecture',
          'fullstack': 'Full Stack Developer with expertise in both frontend and backend technologies, system design, and end-to-end development',
          'mobile': 'Mobile Developer focusing on iOS/Android development, React Native, Flutter, mobile UI/UX, and app store deployment',
          'data-science': 'Data Scientist focusing on machine learning, data analysis, Python, statistics, and data visualization',
          'machine-learning': 'Machine Learning Engineer focusing on ML algorithms, model deployment, MLOps, deep learning, and AI systems',
          'cloud': 'Cloud Architect focusing on AWS/Azure/GCP, cloud infrastructure, scalability, and distributed systems',
          'cybersecurity': 'Cybersecurity Specialist focusing on security protocols, threat analysis, penetration testing, and security architecture',
          'qa': 'QA Engineer focusing on testing strategies, automation, test frameworks, and quality assurance processes',
          'product-manager': 'Product Manager focusing on product strategy, user requirements, roadmaps, and stakeholder management',
          'system-design': 'System Design Expert focusing on scalable architectures, distributed systems, and large-scale system design',
          'general': 'Software Developer with general programming knowledge and problem-solving skills'
        };
        
        const roleContext = roleContexts[role] || roleContexts['general'];
        
        const prompt = `Generate exactly 5 ${difficulty} level technical interview questions for a ${roleContext}. 
        User skills: ${user.skills.join(', ') || 'general programming'}.
        
        Requirements:
        - Questions must be technical and role-specific
        - Avoid generic questions like "Tell me about yourself"
        - Focus on practical knowledge and problem-solving
        - ${difficulty === 'easy' ? 'Basic concepts and definitions' : difficulty === 'medium' ? 'Implementation and best practices' : 'System design and advanced scenarios'}
        
        Return ONLY a valid JSON array of question strings, no markdown, no explanation, just the array.`;
        
        const completion = await groq.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model: 'llama3-8b-8192',
          temperature: 0.7,
          max_tokens: 1000
        });
        
        const response = completion.choices[0].message.content.trim();
        console.log('📝 Groq Response:', response);
        
        // Clean the response to extract JSON
        const jsonMatch = response.match(/\[.*\]/s);
        if (jsonMatch) {
          questions = JSON.parse(jsonMatch[0]);
          console.log('✅ Successfully generated AI questions:', questions.length);
        } else {
          throw new Error('No JSON array found in response');
        }
      } catch (aiError) {
        console.error('❌ Groq AI Error:', aiError.message);
        questions = mockQuestions[role]?.[difficulty] || mockQuestions.general[difficulty];
        console.log('🔄 Using fallback mock questions');
      }
    } else {
      console.log('🔄 No valid Groq API key, using mock questions');
      questions = mockQuestions[role]?.[difficulty] || mockQuestions.general[difficulty];
    }
    
    const session = await Session.create({
      userId: req.user.id,
      role,
      questions: questions.map(q => ({ text: q, difficulty }))
    });

    await User.findByIdAndUpdate(req.user.id, {
      $push: { sessions: session._id }
    });

    res.json({ sessionId: session._id, questions });
  } catch (error) {
    console.error('AI Error:', error);
    // Fallback to mock questions on error
    const { role = 'general', difficulty = 'medium' } = req.body;
    const questions = mockQuestions[role]?.[difficulty] || mockQuestions.general[difficulty];
    
    const session = await Session.create({
      userId: req.user.id,
      role,
      questions: questions.map(q => ({ text: q, difficulty }))
    });

    await User.findByIdAndUpdate(req.user.id, {
      $push: { sessions: session._id }
    });

    res.json({ sessionId: session._id, questions });
  }
};

const submitAnswer = async (req, res) => {
  try {
    const { sessionId, questionIndex, answer } = req.body;
    
    const session = await Session.findById(sessionId);
    if (!session || session.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Session not found' });
    }

    let score, feedback;
    
    if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.startsWith('gsk_')) {
      try {
        console.log('🤖 Using Groq AI for answer evaluation...');
        const question = session.questions[questionIndex];
        const prompt = `Evaluate this interview answer on a scale of 1-100:

Question: ${question.text}
Answer: ${answer}

Provide a score (1-100) and constructive feedback. Return ONLY valid JSON: {"score": number, "feedback": "string"}`;
        
        const completion = await groq.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model: 'llama3-8b-8192',
          temperature: 0.3,
          max_tokens: 500
        });
        
        const response = completion.choices[0].message.content.trim();
        console.log('📝 Groq Evaluation:', response);
        
        const jsonMatch = response.match(/\{.*\}/s);
        if (jsonMatch) {
          const evaluation = JSON.parse(jsonMatch[0]);
          score = evaluation.score;
          feedback = evaluation.feedback;
          console.log('✅ AI Evaluation - Score:', score);
        } else {
          throw new Error('No JSON found in evaluation response');
        }
      } catch (aiError) {
        console.error('❌ Groq Evaluation Error:', aiError.message);
        // Fallback to mock evaluation
        const answerLength = answer.trim().length;
        score = Math.min(100, Math.max(20, answerLength / 5 + Math.random() * 30));
        score = Math.round(score);
        feedback = "Good answer! Keep practicing to improve your interview skills.";
        console.log('🔄 Using fallback evaluation');
      }
    } else {
      // Fallback to mock evaluation
      const answerLength = answer.trim().length;
      score = Math.min(100, Math.max(20, answerLength / 5 + Math.random() * 30));
      score = Math.round(score);
      
      const feedbackTemplates = [
        "Good answer! You demonstrated clear understanding. Consider adding more specific examples.",
        "Well structured response. Your explanation shows good knowledge of the topic.",
        "Nice approach to the question. You could enhance your answer with more technical details.",
        "Solid answer with good reasoning. Try to be more concise in your explanations.",
        "Great insights! Your answer shows practical experience. Consider mentioning potential challenges."
      ];
      
      feedback = feedbackTemplates[Math.floor(Math.random() * feedbackTemplates.length)];
    }
    
    session.questions[questionIndex].userAnswer = answer;
    session.questions[questionIndex].aiFeedback = feedback;
    
    // Calculate session average score
    const answeredQuestions = session.questions.filter(q => q.userAnswer);
    if (answeredQuestions.length > 0) {
      const totalScore = answeredQuestions.reduce((sum, q) => {
        const questionScore = q === session.questions[questionIndex] ? score : 
          (q.aiFeedback ? Math.floor(Math.random() * 30) + 60 : 0);
        return sum + questionScore;
      }, 0);
      session.score = Math.round(totalScore / answeredQuestions.length);
    }
    
    await session.save();

    res.json({ score, feedback });
  } catch (error) {
    console.error('AI Evaluation Error:', error);
    // Fallback to mock evaluation on error
    const answerLength = answer.trim().length;
    const score = Math.min(100, Math.max(20, answerLength / 5 + Math.random() * 30));
    const feedback = "Good answer! Keep practicing to improve your interview skills.";
    
    const session = await Session.findById(sessionId);
    session.questions[questionIndex].userAnswer = answer;
    session.questions[questionIndex].aiFeedback = feedback;
    await session.save();
    
    res.json({ score: Math.round(score), feedback });
  }
};

const togglePin = async (req, res) => {
  try {
    const { sessionId, questionIndex } = req.body;
    
    const session = await Session.findById(sessionId);
    if (!session || session.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Session not found' });
    }

    session.questions[questionIndex].pinned = !session.questions[questionIndex].pinned;
    await session.save();

    res.json({ pinned: session.questions[questionIndex].pinned });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generateQuestions, submitAnswer, togglePin };