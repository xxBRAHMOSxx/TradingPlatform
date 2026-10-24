import { Inngest} from "inngest";

export const inngest = new Inngest({
    id: "Trader's Platform",
    ai: { gemini: { apiKey: process.env.GEMINI_API_KEY! }}
})
