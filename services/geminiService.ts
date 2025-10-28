import { GoogleGenAI, Type } from "@google/genai";
import { Question, DreamAnalysis, Answers } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateQuestions = async (description: string): Promise<Question[]> => {
  const prompt = `Basado en la siguiente descripción de un sueño, genera de 3 a 5 preguntas de opción múltiple para obtener más detalles. El objetivo es recopilar información para crear una narrativa más rica. Devuelve la respuesta como un objeto JSON con una clave 'questions', que es un array de objetos. Cada objeto debe tener una 'question' (string) y 'options' (array de 3-4 strings concisos). Descripción del sueño: "${description}"`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ['question', 'options']
              }
            }
          },
          required: ['questions']
        }
      }
    });

    const jsonString = response.text;
    const parsed = JSON.parse(jsonString);
    return parsed.questions || [];
  } catch (error) {
    console.error("Error generating questions:", error);
    throw new Error("No se pudieron generar las preguntas a partir de la descripción del sueño.");
  }
};

export const analyzeDream = async (description: string, answers: Answers): Promise<DreamAnalysis> => {
  let formattedAnswers = "";
  for (const [question, answer] of Object.entries(answers)) {
    if (answer === null) {
      formattedAnswers += `- Para la pregunta "${question}", el soñador no recuerda.\n`;
    } else if (answer.length > 0) {
      formattedAnswers += `- Para la pregunta "${question}", el soñador recuerda: ${answer.join(', ')}.\n`;
    }
  }

  const prompt = `
      Eres un experto analista de sueños y un narrador creativo, versado en las teorías de Jung y Freud.
      Con base en los siguientes detalles del sueño, realiza dos tareas en español:

      1.  **Narrativa Aumentada:** Escribe una narrativa detallada en primera persona del sueño. Entrelaza la descripción inicial y las respuestas a las preguntas aclaratorias en una historia coherente y vívida. Si el usuario no recordaba ciertos detalles, llena los vacíos de forma creativa y fluida de una manera que se sienta natural a la atmósfera del sueño. La narrativa debe ser inmersiva y atractiva.

      2.  **Interpretación del Sueño:** Proporciona un análisis reflexivo del significado potencial del sueño. Explica el simbolismo de los elementos clave del sueño. Basa tu interpretación en teorías psicológicas establecidas (como las de Carl Jung o Sigmund Freud) pero preséntala de una manera accesible y empática. Usa Markdown para el formato (ej., encabezados, negritas, listas).

      Aquí están los detalles del sueño:
      - Descripción Inicial: "${description}"
      - Detalles Aclaratorios:
        ${formattedAnswers}

      Devuelve la respuesta como un único objeto JSON con dos claves: "narrative" (un string que contiene la historia completa) e "interpretation" (un string que contiene el análisis).
    `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            narrative: { type: Type.STRING, description: "The augmented dream narrative." },
            interpretation: { type: Type.STRING, description: "The psychological interpretation of the dream." }
          },
          required: ['narrative', 'interpretation']
        }
      }
    });

    const jsonString = response.text;
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error analyzing dream:", error);
    throw new Error("No se pudo generar el análisis del sueño.");
  }
};
