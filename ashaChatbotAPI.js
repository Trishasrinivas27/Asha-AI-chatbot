/**
 * Asha AI Chatbot - Backend Integration
 * This file contains the functionality for integrating the Asha AI Chatbot with backend systems
 */

// Chatbot API Integration Module
const fs = require('fs');
    const path = require('path');
    
    const intents = JSON.parse(
      fs.readFileSync(path.join(__dirname,'intents3.json'), 'utf-8')
    );
    
    function getResponse(message) {
        const lowerMsg = message.toLowerCase();
    
        // Example logic for matching intents
        if (lowerMsg.includes('hello')) {
            return 'Hello! How can I assist you?';
        } else if (lowerMsg.includes('bye')) {
            return 'Goodbye! Have a great day!';
        } else {
            return "Sorry, I don't understand that yet.";
        }
    }
    module.exports = { getResponse };
    
    
class AshaChatbotAPI {
    constructor() {
        // API endpoints (would be actual endpoints in production)
        this.endpoints = {
            message: '/api/chatbot/message',
            feedback: '/api/chatbot/feedback',
            analytics: '/api/chatbot/analytics',
            knowledge: '/api/knowledge/query',
            jobs: '/api/jobs/search',
            events: '/api/events/upcoming',
            mentorship: '/api/mentorship/programs'
        };
        
        // Session data for context management
        this.sessionData = {
            sessionId: this.generateSessionId(),
            conversationHistory: [],
            userPreferences: {},
            contextualData: {}
        };
        
        // Initialize bias detection system
        //this.biasDetector = new BiasDetectionSystem();
        
        // Initialize knowledge retrieval system
        //this.knowledgeRetriever = new KnowledgeRetrievalSystem();
        
        // Initialize analytics tracker
        //this.analyticsTracker = new AnalyticsTracker();
    }
    
    /**
     * Generate a unique session ID
     * @returns {string} - Unique session ID
     */
    generateSessionId() {
        return 'asha_' + Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15) + 
               '_' + Date.now();
    }
    
    /**
     * Process user message and generate response
     * @param {string} message - User message
     * @returns {Promise<Object>} - Response object
     */
    async processMessage(message) {
        try {
            // Track message for analytics
            this.analyticsTracker.trackUserMessage(message);
            
            // Check for bias in the message
            const biasCheckResult = this.biasDetector.checkForBias(message);
            if (biasCheckResult.hasBias) {
                return this.handleBiasedMessage(biasCheckResult, message);
            }
            
            // Add message to conversation history
            this.sessionData.conversationHistory.push({
                role: 'user',
                content: message,
                timestamp: new Date().toISOString()
            });
            
            // Analyze message intent
            const intent = await this.analyzeIntent(message);
            
            // Retrieve contextual information
            const context = this.getConversationContext();
            
            // Generate response based on intent and context
            const response = await this.generateResponse(intent, message, context);
            
            // Add response to conversation history
            this.sessionData.conversationHistory.push({
                role: 'assistant',
                content: response.message,
                timestamp: new Date().toISOString()
            });
            
            // Update context with new information
            this.updateContext(intent, response.data);
            
            // Track response for analytics
            this.analyticsTracker.trackBotResponse(response);
            
            return response;
        } catch (error) {
            console.error('Error processing message:', error);
            return this.handleError(error);
        }
    }
    
    /**
     * Analyze user message intent
     * @param {string} message - User message
     * @returns {Promise<Object>} - Intent object
     */
    async analyzeIntent(message) {
        // In production, this would call a natural language understanding API
        // For demonstration, we'll use a simple keyword-based approach
        
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('job') || lowerMessage.includes('career') || 
            lowerMessage.includes('work') || lowerMessage.includes('position') || 
            lowerMessage.includes('employment')) {
            return {
                type: 'job_search',
                confidence: 0.85,
                entities: this.extractJobEntities(message)
            };
        } else if (lowerMessage.includes('mentor') || lowerMessage.includes('guidance') || 
                   lowerMessage.includes('advice') || lowerMessage.includes('coach')) {
            return {
                type: 'mentorship',
                confidence: 0.82,
                entities: this.extractMentorshipEntities(message)
            };
        } else if (lowerMessage.includes('event') || lowerMessage.includes('workshop') || 
                   lowerMessage.includes('webinar') || lowerMessage.includes('conference')) {
            return {
                type: 'event_info',
                confidence: 0.88,
                entities: this.extractEventEntities(message)
            };
        } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || 
                   lowerMessage.includes('hey') || lowerMessage.includes('greetings')) {
            return {
                type: 'greeting',
                confidence: 0.95,
                entities: {}
            };
        } else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks') || 
                   lowerMessage.includes('appreciate')) {
            return {
                type: 'gratitude',
                confidence: 0.90,
                entities: {}
            };
        } else if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye') || 
                   lowerMessage.includes('see you')) {
            return {
                type: 'farewell',
                confidence: 0.85,
                entities: {}
            };
        } else {
            // If no clear intent is detected, try to retrieve relevant knowledge
            const knowledgeResult = await this.knowledgeRetriever.retrieveRelevantKnowledge(message);
            
            if (knowledgeResult.relevance > 0.7) {
                return {
                    type: 'knowledge_query',
                    confidence: knowledgeResult.relevance,
                    entities: knowledgeResult.entities,
                    knowledgeId: knowledgeResult.id
                };
            }
            
            // Fall back to general conversation
            return {
                type: 'general_conversation',
                confidence: 0.5,
                entities: {}
            };
        }
    }
    
    /**
     * Extract job-related entities from message
     * @param {string} message - User message
     * @returns {Object} - Extracted entities
     */
    extractJobEntities(message) {
        const entities = {};
        const lowerMessage = message.toLowerCase();
        
        // Extract job roles
        const jobRoles = ['developer', 'engineer', 'manager', 'designer', 'analyst', 
                          'marketing', 'sales', 'hr', 'finance', 'product'];
        
        for (const role of jobRoles) {
            if (lowerMessage.includes(role)) {
                entities.role = role;
                break;
            }
        }
        
        // Extract locations
        const locations = ['bangalore', 'mumbai', 'delhi', 'hyderabad', 'chennai', 
                           'pune', 'remote', 'work from home', 'wfh'];
        
        for (const location of locations) {
            if (lowerMessage.includes(location)) {
                entities.location = location;
                break;
            }
        }
        
        // Extract job types
        const jobTypes = ['full-time', 'part-time', 'contract', 'freelance', 
                          'internship', 'remote'];
        
        for (const type of jobTypes) {
            if (lowerMessage.includes(type)) {
                entities.type = type;
                break;
            }
        }
        
        // Extract experience level
        if (lowerMessage.includes('entry') || lowerMessage.includes('junior') || 
            lowerMessage.includes('fresher')) {
            entities.experience = 'entry-level';
        } else if (lowerMessage.includes('mid') || lowerMessage.includes('intermediate')) {
            entities.experience = 'mid-level';
        } else if (lowerMessage.includes('senior') || lowerMessage.includes('experienced')) {
            entities.experience = 'senior-level';
        }
        
        return entities;
    }
    
    /**
     * Extract mentorship-related entities from message
     * @param {string} message - User message
     * @returns {Object} - Extracted entities
     */
    extractMentorshipEntities(message) {
        const entities = {};
        const lowerMessage = message.toLowerCase();
        
        // Extract fields
        const fields = ['tech', 'technology', 'leadership', 'management', 
                        'career', 'transition', 'entrepreneurship', 'business'];
        
        for (const field of fields) {
            if (lowerMessage.includes(field)) {
                entities.field = field;
                break;
            }
        }
        
        // Extract duration preferences
        if (lowerMessage.includes('short') || lowerMessage.includes('quick')) {
            entities.duration = 'short-term';
        } else if (lowerMessage.includes('long') || lowerMessage.includes('extended')) {
            entities.duration = 'long-term';
        }
        
        // Extract format preferences
        if (lowerMessage.includes('one-on-one') || lowerMessage.includes('1:1') || 
            lowerMessage.includes('individual')) {
            entities.format = 'one-on-one';
        } else if (lowerMessage.includes('group') || lowerMessage.includes('team')) {
            entities.format = 'group';
        }
        
        return entities;
    }
    
    /**
     * Extract event-related entities from message
     * @param {string} message - User message
     * @returns {Object} - Extracted entities
     */
    extractEventEntities(message) {
        const entities = {};
        const lowerMessage = message.toLowerCase();
        
        // Extract event types
        const eventTypes = ['workshop', 'webinar', 'conference', 'meetup', 
                            'networking', 'summit', 'session'];
        
        for (const type of eventTypes) {
            if (lowerMessage.includes(type)) {
                entities.type = type;
                break;
            }
        }
        
        // Extract topics
        const topics = ['tech', 'technology', 'leadership', 'career', 
                        'transition', 'entrepreneurship', 'business', 'skill'];
        
        for (const topic of topics) {
            if (lowerMessage.includes(topic)) {
                entities.topic = topic;
                break;
            }
        }
        
        // Extract time frame
        if (lowerMessage.includes('today') || lowerMessage.includes('now')) {
            entities.timeFrame = 'today';
        } else if (lowerMessage.includes('tomorrow')) {
            entities.timeFrame = 'tomorrow';
        } else if (lowerMessage.includes('this week')) {
            entities.timeFrame = 'this-week';
        } else if (lowerMessage.includes('this month')) {
            entities.timeFrame = 'this-month';
        } else if (lowerMessage.includes('upcoming')) {
            entities.timeFrame = 'upcoming';
        }
        
        // Extract location preferences
        if (lowerMessage.includes('virtual') || lowerMessage.includes('online')) {
            entities.location = 'virtual';
        } else if (lowerMessage.includes('in-person') || lowerMessage.includes('physical')) {
            entities.location = 'in-person';
        }
        
        return entities;
    }
    
    /**
     * Get conversation context from session data
     * @returns {Object} - Conversation context
     */
    getConversationContext() {
        // Extract relevant context from conversation history
        const recentMessages = this.sessionData.conversationHistory.slice(-5);
        
        // Determine current topic
        let currentTopic = null;
        for (let i = recentMessages.length - 1; i >= 0; i--) {
            const message = recentMessages[i];
            if (message.role === 'assistant' && message.topic) {
                currentTopic = message.topic;
                break;
            }
        }
        
        return {
            sessionId: this.sessionData.sessionId,
            recentMessages,
            currentTopic,
            userPreferences: this.sessionData.userPreferences,
            contextualData: this.sessionData.contextualData
        };
    }
    
    /**
     * Update conversation context with new information
     * @param {Object} intent - Message intent
     * @param {Object} data - Response data
     */
    updateContext(intent, data) {
        // Update context based on intent type
        switch (intent.type) {
            case 'job_search':
                this.sessionData.contextualData.lastJobSearch = {
                    query: intent.entities,
                    results: data.jobs || []
                };
                break;
                
            case 'mentorship':
                this.sessionData.contextualData.lastMentorshipQuery = {
                    query: intent.entities,
                    results: data.programs || []
                };
                break;
                
            case 'event_info':
                this.sessionData.contextualData.lastEventQuery = {
                    query: intent.entities,
                    results: data.events || []
                };
                break;
                
            case 'knowledge_query':
                if (data.userPreferences) {
                    this.sessionData.userPreferences = {
                        ...this.sessionData.userPreferences,
                        ...data.userPreferences
                    };
                }
                break;
        }
        
        // Store the current topic
        this.sessionData.contextualData.currentTopic = intent.type;
    }
    
    /**
     * Generate response based on intent and context
     * @param {Object} intent - Message intent
     * @param {string} message - User message
     * @param {Object} context - Conversation context
     * @returns {Promise<Object>} - Response object
     */
    async generateResponse(intent, message, context) {
        switch (intent.type) {
            case 'greeting':
                return this.generateGreetingResponse(context);
                
            case 'job_search':
                return await this.generateJobSearchResponse(intent.entities, context);
                
            case 'mentorship':
                return await this.generateMentorshipResponse(intent.entities, context);
                
            case 'event_info':
                return await this.generateEventResponse(intent.entities, context);
                
            case 'knowledge_query':
                return await this.generateKnowledgeResponse(intent.knowledgeId, message, context);
                
            case 'gratitude':
                return this.generateGratitudeResponse(context);
                
            case 'farewell':
                return this.generateFarewellResponse(context);
                
            case 'general_conversation':
            default:
                return this.generateGeneralResponse(message, context);
        }
    }
    
    /**
     * Generate greeting response
     * @param {Object} context - Conversation context
     * @returns {Object} - Response object
     */
    generateGreetingResponse(context) {
        const greetings = [
            "Hello! I'm Asha, your AI career assistant. How can I help you today?",
            "Hi there! I'm Asha, ready to assist with your career goals. Let's get started!",
            "Greetings! I'm here to support your career journey—whether it’s finding jobs, mentorship, or events.",
            "Hey! I'm Asha. Ask me anything about jobs, events, mentorship programs, or skills."
        ];
    
        const randomIndex = Math.floor(Math.random() * greetings.length);
        return {
            message: greetings[randomIndex],
            data: context || {}
        };
    }
    
    

    
}
