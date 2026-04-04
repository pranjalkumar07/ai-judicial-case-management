import { GoogleGenAI, Type, Chat, HarmCategory, HarmBlockThreshold } from '@google/genai';
import type {
  RAGResult,
  CitizenAnalysisResult,
  PrecedentAnalysisResult,
  SimilarCaseAnalysisResult,
  CaseChatMessage,
  AIResearchPipelineResult,
  LegalDraftType,
  BiasAnalysisResult,
  NextStepsResponse,
  ArgumentBuilderResult,
} from '../types';

/**
 * Creates a fresh GoogleGenAI instance.
 */
const getAi = () => new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });

// Using stable model names for better local reliability
const MODEL_PRO = 'gemini-flash-latest';
const MODEL_FLASH = 'gemini-flash-latest';

// Disable safety filters for legal analysis to prevent empty responses
const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

/**
 * Robustly parses JSON from the AI response.
 * Handles cases where the model includes markdown or conversational filler.
 */
const parseResponse = <T>(text: string | undefined): T => {
  if (!text) throw new Error('AI returned an empty response.');
  
  const cleanText = text.trim();
  
  // Try direct parsing first
  try {
    return JSON.parse(cleanText);
  } catch (e) {
    // If direct fails, attempt to extract JSON from markdown or string content
    try {
      const jsonMatch = cleanText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (innerE) {
      console.error('Deep parse failed:', cleanText);
    }
    throw new Error('The AI response could not be understood as data. Please try again.');
  }
};

// Citizen: Analyze Dispute
export const analyzeDispute = async (
  disputeText: string
): Promise<CitizenAnalysisResult> => {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: MODEL_FLASH,
    contents: `Analyze this Indian legal dispute and return JSON. Follow DPDP Act 2023 principles.\n\nDispute: ${disputeText}`,
    config: {
      systemInstruction: 'You are an expert Indian Legal Consultant. You must only respond with valid JSON based on the provided schema.',
      responseMimeType: 'application/json',
      safetySettings,
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          case_classification: { type: Type.STRING },
          legal_domain: { type: Type.STRING },
          primary_issue: { type: Type.STRING },
          legal_summary: { type: Type.STRING },
          probable_remedy: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggested_lawyer_type: { type: Type.STRING },
          recommended_lawyers: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                specialization: { type: Type.STRING },
                experience_years: { type: Type.INTEGER },
                success_rate: { type: Type.STRING },
                location: { type: Type.STRING },
                profile_id: { type: Type.STRING },
                contact_option: { type: Type.STRING },
              },
              required: ['name', 'specialization', 'experience_years', 'success_rate', 'location', 'profile_id', 'contact_option'],
            },
          },
          lawyer_request_summary: { type: Type.STRING },
          urgency: { type: Type.STRING },
          portal_recommendation: { type: Type.STRING },
        },
        required: ['case_classification', 'legal_domain', 'primary_issue', 'legal_summary', 'probable_remedy', 'suggested_lawyer_type', 'recommended_lawyers', 'lawyer_request_summary', 'urgency', 'portal_recommendation'],
      },
    },
  });

  return parseResponse(response.text);
};

// Precedent: RAG Search
export const performRAGSearch = async (
  query: string,
  documentText: string
): Promise<RAGResult> => {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: MODEL_FLASH,
    contents: `Based on the following document, answer the question and provide 3 citations.\n\nDoc: ${documentText}\nQuestion: ${query}`,
    config: {
      responseMimeType: 'application/json',
      safetySettings,
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          answer: { type: Type.STRING },
          citations: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['answer', 'citations']
      }
    }
  });
  return parseResponse(response.text);
};

// Judge: Precedent Analysis
export const getPrecedentAnalysis = async (
  documentText: string
): Promise<PrecedentAnalysisResult> => {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: MODEL_PRO,
    contents: `Deep dive analysis of this judgment: ${documentText}`,
    config: {
      responseMimeType: 'application/json',
      safetySettings,
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          keyArguments: {
            type: Type.OBJECT,
            properties: {
              plaintiff: { type: Type.STRING },
              defendant: { type: Type.STRING }
            }
          },
          influencingStatutes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                statute: { type: Type.STRING },
                quote: { type: Type.STRING },
                relevance: { type: Type.STRING }
              }
            }
          },
          consistencyCheck: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                issue: { type: Type.STRING },
                explanation: { type: Type.STRING }
              }
            }
          },
          biasDetection: {
            type: Type.OBJECT,
            properties: {
              warning: { type: Type.STRING }
            }
          }
        }
      }
    }
  });
  return parseResponse(response.text);
};

// Advocate: Similar Case Analyzer
export const getSimilarCases = async (
  caseFacts: string
): Promise<SimilarCaseAnalysisResult> => {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: MODEL_PRO,
    contents: `Retrieve similar case law examples for: ${caseFacts}`,
    config: {
      responseMimeType: 'application/json',
      safetySettings,
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          role: { type: Type.STRING },
          feature: { type: Type.STRING },
          case_context_summary: { type: Type.STRING },
          similar_cases_found: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                case_title: { type: Type.STRING },
                citation_or_year: { type: Type.STRING },
                court_name: { type: Type.STRING },
                summary_of_decision: { type: Type.STRING },
                relevance_score: { type: Type.NUMBER },
                key_sections_cited: { type: Type.ARRAY, items: { type: Type.STRING } },
                legal_takeaway: { type: Type.STRING }
              }
            }
          },
          overall_summary: { type: Type.STRING },
          suggested_action: { type: Type.STRING }
        }
      }
    }
  });
  return parseResponse(response.text);
};

// Advocate: Argument Builder
export const generateArguments = async (
  caseFacts: string,
  desiredOutcome: string,
  legalStance: 'Plaintiff' | 'Defendant'
): Promise<ArgumentBuilderResult> => {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: MODEL_PRO,
    contents: `Build a ${legalStance} argument strategy. Outcome: ${desiredOutcome}. Facts: ${caseFacts}`,
    config: {
      responseMimeType: 'application/json',
      safetySettings,
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          core_argument: { type: Type.STRING },
          supporting_points: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                point: { type: Type.STRING },
                explanation: { type: Type.STRING }
              }
            }
          },
          potential_counter_arguments: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                argument: { type: Type.STRING },
                rebuttal: { type: Type.STRING }
              }
            }
          },
          evidence_checklist: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggested_precedents: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  });
  return parseResponse(response.text);
};

// Chat Helpers
export const getChatSummary = async (history: CaseChatMessage[]): Promise<string> => {
  const ai = getAi();
  const chatHistoryText = history.map((m) => `${m.role}: ${m.text}`).join('\n');
  const response = await ai.models.generateContent({
    model: MODEL_FLASH,
    contents: `Provide a concise legal summary of this conversation: \n${chatHistoryText}`,
    config: { safetySettings }
  });
  return response.text || "Summary currently unavailable.";
};

export const getSuggestedNextSteps = async (history: CaseChatMessage[]): Promise<NextStepsResponse> => {
  const ai = getAi();
  const chatHistoryText = history.map((m) => `${m.role}: ${m.text}`).join('\n');
  const response = await ai.models.generateContent({
    model: MODEL_FLASH,
    contents: `Suggest 3 next steps based on this history: \n${chatHistoryText}`,
    config: {
      responseMimeType: 'application/json',
      safetySettings,
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          clarification_needed: { type: Type.STRING }
        },
        required: ['suggestions']
      }
    }
  });
  return parseResponse(response.text);
};

export const getAIResearchSummary = async (
  caseFacts: string,
  similarCases: SimilarCaseAnalysisResult,
  ragResult: RAGResult
): Promise<AIResearchPipelineResult> => {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: MODEL_PRO,
    contents: `Synthesize this data into a research report. Facts: ${caseFacts}. Cases: ${JSON.stringify(similarCases)}. Statutes: ${JSON.stringify(ragResult)}`,
    config: {
      responseMimeType: 'application/json',
      safetySettings,
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          pipeline_stage: { type: Type.STRING },
          case_context: { type: Type.STRING },
          similar_cases: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                case_title: { type: Type.STRING },
                court_name: { type: Type.STRING },
                citation: { type: Type.STRING },
                relevance_score: { type: Type.NUMBER }
              }
            }
          },
          rag_results: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                section: { type: Type.STRING },
                summary: { type: Type.STRING }
              }
            }
          },
          final_summary: { type: Type.STRING },
          argument_suggestion: { type: Type.STRING }
        }
      }
    }
  });
  return parseResponse(response.text);
};

export const monitorForBias = async (documentText: string): Promise<BiasAnalysisResult> => {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: MODEL_PRO,
    contents: `Scan for bias or hallucinations: ${documentText}`,
    config: {
      responseMimeType: 'application/json',
      safetySettings,
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          has_bias: { type: Type.BOOLEAN },
          findings: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                phrase: { type: Type.STRING },
                bias_type: { type: Type.STRING },
                explanation: { type: Type.STRING },
                suggestion: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });
  return parseResponse(response.text);
};

export const generateLegalDraft = async (
  draftType: LegalDraftType,
  caseContext: string,
  keyPoints: string
): Promise<string> => {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: MODEL_PRO,
    contents: `Generate a professional ${draftType} (India style). Context: ${caseContext}. Points: ${keyPoints}`,
    config: { safetySettings }
  });
  return response.text || "Error generating draft content.";
};

export const createChatSession = (systemInstruction?: string): Chat => {
  const ai = getAi();
  return ai.chats.create({
    model: MODEL_FLASH,
    config: {
      systemInstruction: systemInstruction || "You are a helpful legal assistant for the AI Justice Hub.",
      safetySettings
    },
  });
};