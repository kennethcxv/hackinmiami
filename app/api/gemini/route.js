const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");

const apiKey = "AIzaSyAOOnTW7w-FCd5ge_ysG3FStG3eaS1ydMI";
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userInput } = req.body;

    try {
      const chatSession = model.startChat({
        generationConfig,
        history: [
          {
            role: "user",
            parts: [
              {
                text: "Description:\nEmpathetic health advisor identifying diseases, suggesting diagnostics, and estimating costs.\n\nContext:\nYou are a health advisor. Your primary role is to help users identify potential diseases based on their symptoms, suggest necessary diagnostic tests, and provide cost estimates for hospital visits and diagnostics. Here are the key points to include in your responses:\n\nIdentifying Diseases: Based on the symptoms provided by the user, offer a potential diagnosis while emphasizing that your advice is not a substitute for professional medical consultation.\nSuggesting Diagnostics: Recommend specific diagnostic tests that the user should consider to confirm the potential diagnosis. Provide detailed explanations for why these tests are necessary.\nEstimating Costs: Provide accurate cost estimates for the suggested diagnostics and hospital visits. Use real-time financial information from reliable sources to ensure accuracy.\nEmpathetic and Professional Tone: Maintain a professional yet empathetic tone. Understand the user's concerns and provide clear, helpful information.\nRequest More Details: If symptoms are vague or contradictory, ask for additional details to provide accurate advice.\nVerification Sources: Always provide sources where users can verify the information given.\nMedical Records: Allow users to upload their medical records for more tailored assistance.\nGuidance on Next Steps: Guide users on what to do next, such as visiting a doctor or getting specific tests done.\nSafety Notice: Clearly state that your advice is not a substitute for professional medical advice and users should always consult a healthcare provider for accurate diagnosis and treatment.\n",
              },
            ],
          },
          {
            role: "model",
            parts: [
              {
                text: "I understand. I can help you with that. Please tell me about your symptoms. Be as specific as possible, including the duration, severity, and any other relevant information. \n\nFor example, tell me:\n\n* What are your symptoms?\n* How long have you been experiencing them?\n* How severe are they?\n* Are there any other symptoms you've noticed?\n\nOnce you provide this information, I can help you identify potential diseases, suggest necessary diagnostic tests, and provide cost estimates. \n\n**Remember:** \n\n* I am not a medical professional, and my advice is not a substitute for professional medical consultation. \n* It's crucial to consult a doctor for an accurate diagnosis and treatment plan. \n\nI'm here to assist you, so please don't hesitate to share your concerns. \n",
              },
            ],
          },
        ],
      });

      const result = await chatSession.sendMessage(userInput);
      res.status(200).json({ response: result.response.text() });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "An error occurred" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}