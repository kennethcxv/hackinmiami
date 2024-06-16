import { NextResponse } from "next/server";

const { VertexAI } = require("@google-cloud/vertexai");

export async function POST(req, res) {
  const { symptoms, location } = await req.json();
  // const symptoms = ["vomiting", 'nausea', "headache"]
  // const location = "33174"

  // Initialize Vertex with your Cloud project and location
  const vertex_ai = new VertexAI({
    project: "miami-ai-hack24mia-911",
    location: "us-central1",
  });
  const model = "gemini-1.5-flash-001";

  const textsi_1 =
    "You are a health advisor AI. Your role is to identify potential diseases based on a list of symptoms provided by the user, suggest necessary diagnostic tests, recommend nearby hospitals based on the zip code provided by the user, and provide cost estimates for those diagnostics. Your response should be empathetic and professional. Ensure to return the results in a JSON format with the key being the disease and the value being a list of the diagnostic tests, recommended hospitals, and their associated costs.";
  const textsi_2 =
    "Return the results in a JSON format where the key is the name of the category and the value is a list containing values for those category, I have define the category below, I only need that nothing else, and try to do google search for the hospitals based on the zip code";

  // Instantiate the models
  const generativeModel = vertex_ai.preview.getGenerativeModel({
    model: model,
    generationConfig: {
      maxOutputTokens: 8192,
      temperature: 0.5,
      topP: 0.95,
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
    ],
    tools: [
      {
        googleSearchRetrieval: {
          disableAttribution: false,
        },
      },
    ],
    systemInstruction: {
      parts: [{text: textsi_1}, {"text": `Instructions:`}, 
      {"text": `Analyze the given symptoms to identify potential diseases.`}, 
      {"text": `For each potential disease, suggest the necessary diagnostic tests.`}, 
      {"text": `Provide a list of nearby hospitals that can perform these tests.`}, 
      {"text": `Include estimated costs for these tests at the specified hospitals.`}, 
      {text: textsi_2}, {"text": `Possible diseases`}, {"text": `The necessary diagnostic tests.`}, 
      {"text": `Recommended hospitals.`}, {"text": `Estimated costs at those hospitals.`}, {"text": `Example input {\"Symptoms\": [\"sympton1\",\"sympton2\"], \"location\":ZipCode}`}],
    },
  });

  const chat = generativeModel.startChat({});

  const message = [
    {
      text: `{"Symptoms": [${symptoms.map((s) => `"${s}"`).join(', ')}], "location": ${location}}`,
    },
  ];
//   const message = [
//     {
//       text: `{"Symptoms": [${["diarrhea, vomiting"].map((s) => `"${s}"`).join(', ')}], "location": 33174}`,
//     },
//   ];

  const streamResult = await chat.sendMessageStream(message);
  const response = await streamResult.response;

const object = JSON.parse(response.candidates[0].content.parts[0].text)

  return NextResponse.json({ data: object }, { status: 200 });
}
