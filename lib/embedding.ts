import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "text-embedding-004"});

export const generateEmbeddings = async(text: string)=>{
    const embedding = await model.embedContent(text);
    return Array.from(embedding.embedding.values);
}