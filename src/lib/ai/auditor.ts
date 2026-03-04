import { GoogleGenAI } from '@google/genai';
import { Role } from '@prisma/client';
import { prisma } from '../prisma';

// Initialize the Google Gen AI SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface AuditEvent {
    actorId: string;
    actorRole: Role;
    action: string;
    targetId: string;
}

export async function logAndAnalyzeEvent(event: AuditEvent) {
    try {
        // 1. Construct the prompt for Gemini
        const prompt = `
      You are an AI Security Agent monitoring a Healthcare Management System.
      Analyze the following access event for anomalies or HIPAA compliance violations.
      
      Roles allowed actions generally:
      - ADMIN: Full access, but viewing medical records without a reason is suspicious.
      - DOCTOR: Can view/edit records of their assigned patients.
      - RECEPTIONIST: Can schedule appointments, cannot view medical records.
      - PATIENT: Can only view their own records.
      
      Event Details:
      - Actor Role: ${event.actorRole}
      - Actor ID: ${event.actorId}
      - Action Performed: ${event.action}
      - Target Object ID: ${event.targetId}
      - Timestamp: ${new Date().toISOString()}
      
      Respond STRICTLY in JSON format with two keys:
      {
        "isAnomaly": boolean, // true if suspicious/unauthorized, false if normal
        "reasoning": string // max 2 sentences explaining why
      }
    `;

        // 2. Call Gemini API
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });

        const aiResponseText = response.text;

        let isAnomaly = false;
        let reasoning = "Analysis failed or failed to parse JSON.";

        if (aiResponseText) {
            try {
                const parsed = JSON.parse(aiResponseText);
                isAnomaly = parsed.isAnomaly;
                reasoning = parsed.reasoning;
            } catch (e) {
                console.error("Failed to parse Gemini JSON output:", aiResponseText);
            }
        }

        // 3. Save the log to the database
        const newLog = await prisma.auditLog.create({
            data: {
                actorId: event.actorId,
                actorRole: event.actorRole,
                action: event.action,
                targetId: event.targetId,
                aiFlagged: isAnomaly,
                aiReasoning: `~ GEMINI 2.5 FLASH ~ ${reasoning}`
            }
        });

        return newLog;

    } catch (error) {
        console.error("Error in AI Security Agent:", error);
        // Graceful degradation: Log it anyway without AI analysis if API fails
        return await prisma.auditLog.create({
            data: {
                actorId: event.actorId,
                actorRole: event.actorRole,
                action: event.action,
                targetId: event.targetId,
                aiFlagged: false,
                aiReasoning: "AI Analysis unavailable due to API error."
            }
        });
    }
}
