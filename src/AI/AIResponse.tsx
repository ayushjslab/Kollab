import { chatSession } from "./AIModal";

export async function getResponse(prompt: string) {
    try {
        const result = await chatSession.sendMessage(prompt);
        return result.response.text();
    } catch (error) {
        console.log(error)
    }
}