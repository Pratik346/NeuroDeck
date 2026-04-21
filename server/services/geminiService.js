const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- Helper: Safe JSON Parse ---
const safeParseJSON = (text) => {
  try {
    return JSON.parse(text);
  } catch (err) {
    return null;
  }
};

// --- Helper: Validate Flashcards ---
const validateFlashcards = (data, count) => {
  console.log("errorbefore flashcard generation");
  if (!Array.isArray(data)) return false;
  console.log("error after flashcard generation");
  if (data.length !== count) return false;

  for (let item of data) {
    if (
      typeof item !== "object" ||
      typeof item.question !== "string" ||
      typeof item.answer !== "string"
    ) {
      return false;
    }
  }

  return true;
};

// --- Flashcard Generation ---
const generateFlashcards = async (text, count = 10) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
  });

  //  Basic sanitization (reduce prompt injection risk)
  const sanitizedText = text.replace(/[`$<>]/g, "");

  const prompt = `
You are an expert educator.

Generate EXACTLY ${count} high-quality flashcards from the given text.

STRICT RULES:
- Output ONLY valid JSON
- No markdown, no explanation
- Return EXACTLY ${count} items
- Each item must have:
  - "question" (string)
  - "answer" (string)
- Questions must test understanding (not memorization)
- Answers must be concise and correct

FORMAT:
[
  { "question": "string", "answer": "string" }
]

TEXT:
${sanitizedText}
`;

  let attempts = 3;
  while (attempts > 0) {
    try {
      const result = await model.generateContent(prompt);
      let response = result.response.text();
      // Clean unwanted markdown
      response = response.replace(/```json|```/g, "").trim();
      const parsed = safeParseJSON(response);
      // Validate structure
      if (parsed && validateFlashcards(parsed, count)) {
        return parsed;
      }
      console.warn("Invalid format, retrying...");
    } catch (err) {
      console.error("Error generating flashcards:", err.message);
    }
    attempts--;
  }
  //  Final fallback
  throw new Error("Failed to generate valid flashcards after multiple attempts");
};

module.exports = generateFlashcards;
const evaluateInterview = async (answers) => {
  try {
    if (!Array.isArray(answers) || answers.length === 0) {
      throw new Error("Invalid answers input");
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
    });

    const prompt = `
You are an expert technical interviewer.

Evaluate each answer carefully and return ONLY JSON.
Answers:
${JSON.stringify(answers, null, 2)}

Return EXACTLY this format:
[
  {
    "index": "number",
    "score": number (0-10),
    "isCorrect": boolean,
    "feedback": "2-3 sentence constructive feedback",
    "keyPointsMissed": ["point1", "point2"],
    "strongPoints": ["point1", "point2"]
  }
]

Scoring guide:
- 9-10: Perfect, complete answer
- 7-8: Good answer, minor gaps
- 5-6: Partial understanding
- 3-4: Basic understanding but major gaps
- 0-2: Incorrect or irrelevant

Rules:
- isCorrect = true if score >= 6
- Compare meaning, not exact wording
- Accept synonyms and similar explanations
- Penalize missing key concepts
- Be strict but fair
- Do NOT return any text outside JSON
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    const cleanResponse = response
  .replace(/```json|```/g, "")
  .trim();

// extract first JSON block safely
const jsonMatch = cleanResponse.match(/\[[\s\S]*\]/);

if (!jsonMatch) {
  throw new Error("No valid JSON array found");
}

const data = safeParseJSON(jsonMatch[0]);

    //  Validate output
    if (!Array.isArray(data)) {
      throw new Error("Invalid evaluation format");
    }

    //  Normalize data (important)
    const validated = data.map((item) => ({
      cardId: item.cardId,
      score: Number(item.score) || 0,
      isCorrect: Boolean(item.isCorrect),
      feedback: item.feedback || "",
      keyPointsMissed: item.keyPointsMissed || [],
      strongPoints: item.strongPoints || [],
    }));

    return validated;
  } catch (error) {
    throw new Error("Interview evaluation failed: " + error.message);
  }
};

module.exports = {
  generateFlashcards,
  evaluateInterview,
};