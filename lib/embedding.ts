import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY!});

export const generateEmbeddings = async(text: string)=>{
    const embedding = await genAI.models.embedContent({
        model: "gemini-embedding-001",
        contents : text,
        config : {
            outputDimensionality : 768,
            taskType : "RETRIEVAL_QUERY"
        }
    });
    return Array.from(embedding.embeddings?.[0].values ?? []);
}