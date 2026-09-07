import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Lazy initialization of GoogleGenAI
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

const AYUSH_SYSTEM_INSTRUCTION = `You are the AyushSetu AI Career Advisor, an official intelligent counselor embedded within the AyushSetu platform (National Academia-Industry Collaboration Platform by All India Institute of Ayurveda - AIIA and Ministry of Ayush, Government of India).

Your primary mission:
1. CAREER & INTERNSHIP GUIDANCE:
   - Assist BAMS, BHMS, BUMS, BSMS, BYNS students and Ayush scholars in discovering industrial internships, clinical residencies, and R&D jobs.
   - Reference premier partners: Dabur India R&D, Himalaya Wellness Company, Patanjali Research Foundation, Baidyanath, Charak Pharma, Emami Zandu, CCRAS, CSIR-CDRI, and AIIA Academic Hospital.
   - Advise on roles like Herbal Formulation Scientist, Clinical Research Associate (CRA), ASU Regulatory Affairs Officer, Pharmacovigilance Specialist, and Analytical Chemist.

2. SKILL GAP REMEDIATION:
   - Provide concrete, stepwise learning roadmaps to close academic-industry divergence gaps:
     * Schedule T (ASU GMP): Good Manufacturing Practices under the Drugs and Cosmetics Act 1940 & Rules 1945. Specific requirements for batch manufacturing records (BMR), hygiene, water systems, air handling units (AHU), cross-contamination control, and machinery qualification.
     * Good Clinical Practice (GCP-AYUSH): Ethical trial conduct, informed consent, investigator brochures, case report forms (CRF), and adherence to CCRAS/CDSCO clinical trial norms.
     * Analytical Standardization (HPTLC & HPLC): Botanical identification, TLC fingerprinting, marker quantification (e.g., Withaferin-A in Ashwagandha, Curcuminoids in Haridra, Sennosides), heavy metal limits (AAS/ICP-MS), pesticide residues, aflatoxins, and microbial limits.
     * Pharmacovigilance for ASU Drugs: Adverse drug reaction (ADR) reporting using the Ayush ADR red-and-blue forms, signal detection, and the role of the National Pharmacovigilance Coordination Centre (NPvCC at AIIA).

3. AYUSH REGULATIONS & LICENSING:
   - Explain statutory guidelines: Rule 158-B (Licensing of Patent or Proprietary Ayurveda, Siddha, Unani medicines), Rule 170 (Advertising prohibitions), Pharmacopoeia Commission for Indian Medicine & Homoeopathy (PCIM&H), Ayurvedic Pharmacopoeia of India (API) standards.
   - Explain logbook verification, verified clinical credentials, and MoU academia-industry exchange protocols.

Tone & Style:
- Highly knowledgeable, encouraging, structured, and practical.
- Use clear bullet points, bold key terms, and concise paragraphs.
- Blend traditional Ayurvedic wisdom with modern pharmaceutical standards and regulatory rigor.`;

// Pre-packaged fallback knowledge for when API key is not configured
function getFallbackResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();

  if (lower.includes("schedule t") || lower.includes("gmp")) {
    return `**Schedule T (ASU GMP) Mastery Guide:**\n\nSchedule T under the **Drugs and Cosmetics Act, 1940 & Rules 1945** governs Good Manufacturing Practices for Ayurvedic, Siddha, and Unani (ASU) medicines.\n\n- **Core Requirements:**\n  1. **Factory Hygiene & Infrastructure:** Minimum space requirements for raw material storage, processing, quality control, and finished goods.\n  2. **Air & Water Quality:** Filtered air supplies (HEPA/AHU where required), potability standards for process water.\n  3. **Batch Manufacturing Records (BMR):** Complete documentation from raw herb dispensing to final blister/bottle packaging.\n  4. **Quality Assurance (QA) vs QC:** Independent testing of physical, chemical, and microbial parameters before batch release.\n\n*Action Step on AyushSetu:* Complete the **PCIM&H Schedule T Simulation module** under the Upskilling tab to earn a verified digital compliance badge.`;
  }

  if (lower.includes("internship") || lower.includes("job") || lower.includes("dabur") || lower.includes("himalaya") || lower.includes("patanjali")) {
    return `**Top Active Internships on AyushSetu:**\n\n1. **Herbal Formulation & Extraction Intern** — *Dabur India R&D Centre (Ghaziabad)*\n   - **Focus:** Hydro-alcoholic extraction optimization, stability studies.\n   - **Eligibility:** Final Year BAMS / M.D. (Ayurveda) Dravyaguna.\n2. **Ayush Clinical Research Associate (CRA)** — *Himalaya Wellness (Bengaluru)*\n   - **Focus:** GCP-compliant clinical monitoring, ADR data collation.\n   - **Requirement:** GCP-AYUSH badge & 75%+ logbook completion.\n3. **Quality Control & HPTLC Analyst** — *Patanjali Research Foundation (Haridwar)*\n   - **Focus:** Marker profiling of Withania somnifera and Tinospora cordifolia.\n\n*Pro-tip:* Click on the **Opportunities** tab to view open slots and submit your verified AyushSetu portfolio directly to recruiters.`;
  }

  if (lower.includes("hptlc") || lower.includes("hplc") || lower.includes("analytical") || lower.includes("standardization")) {
    return `**Closing Your Analytical Phytochemistry Gap (HPTLC & HPLC):**\n\nModern ASU manufacturing requires strict marker quantification as mandated by the Ayurvedic Pharmacopoeia of India (API).\n\n- **Key Steps to Master:**\n  1. **Sample Preparation:** Ultrasonic-assisted or Soxhlet extraction using standardized analytical solvents.\n  2. **Stationary Phase & Development:** Silica Gel 60 F254 plates developed in saturated twin-trough chambers.\n  3. **Derivatization:** Anisaldehyde-sulfuric acid or Vanillin-phosphoric acid visualization at 254nm, 366nm, and visible light.\n  4. **Densitometric Scanning:** Peak area integration against validated reference standards (e.g., Curcumin, Withaferin A, Bacoside A).\n\n*Recommended Course:* Take the AIIA-CSIR Joint Certification on Phytochemical Fingerprinting available under the Career Readiness roadmap.`;
  }

  if (lower.includes("gcp") || lower.includes("clinical trial") || lower.includes("trial")) {
    return `**GCP-AYUSH Guidelines for Clinical Trials:**\n\nGood Clinical Practice guidelines developed by CCRAS and the Ministry of Ayush ensure scientific integrity and ethical safety.\n\n- **Crucial Components:**\n  1. **Ethics Committee (IEC) Clearance:** Protocol review, risk-benefit assessment, and trial registration on CTRI (Clinical Trials Registry - India).\n  2. **Informed Consent Process:** Bilingual vernacular documentation and vulnerable population protections.\n  3. **Case Report Forms (CRF):** Meticulous daily clinical symptom scoring (Ayurvedic diagnostic markers like Agni, Koshtha, and Rogibala alongside modern biomarkers).\n  4. **Adverse Event (AE/SAE) Reporting:** Strict 24-hour notification protocol for serious adverse events.`;
  }

  if (lower.includes("rule 158") || lower.includes("158-b") || lower.includes("regulation") || lower.includes("license")) {
    return `**Rule 158-B Licensing for ASU Drugs:**\n\nRule 158-B of the Drugs and Cosmetics Rules defines the proof of effectiveness required for licensing Patent or Proprietary (P&P) ASU medicines:\n\n- **Category A (Classical ASU formulations):** Mentioned in authoritative texts listed in the First Schedule — no safety/efficacy trial needed, only textual citation.\n- **Category B (Extract-based / New Indications):** Safety data, acute toxicity studies (OECD guidelines), and published clinical literature or proof-of-concept trials required.\n- **Labeling Norms:** Clear botanical Latin names, parts used, preservative disclosures, and batch shelf-life limits.`;
  }

  return `Welcome to **AyushSetu Career Advisor**! As your mentor, I can help you with:\n\n- **Internship Matching:** Explore open placements across Dabur, Himalaya, Baidyanath, and CCRAS.\n- **Closing Skill Gaps:** Build mastery in Schedule T (ASU GMP), GCP clinical trial protocols, and HPTLC marker profiling.\n- **Regulatory Affairs:** Navigating Rule 158-B, Pharmacovigilance ADR reporting, and PCIM&H compliance.\n\n*Try asking:* "How can I prepare for a formulation R&D interview at Dabur?" or "What are the key steps in Schedule T compliance?"`;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "AyushSetu API Gateway", timestamp: new Date().toISOString() });
});

// AI Chatbot endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({ error: "Message is required." });
    }

    const trimmedMessage = message.trim();
    const apiKey = process.env.GEMINI_API_KEY;

    // If no API key is set, return rich domain fallback
    if (!apiKey) {
      console.warn("GEMINI_API_KEY not configured. Responding with AyushSetu Advisor knowledge base fallback.");
      const fallbackReply = getFallbackResponse(trimmedMessage);
      return res.json({
        reply: fallbackReply,
        source: "fallback_knowledge_base",
        note: "Configured via AyushSetu Advisor engine. Add GEMINI_API_KEY in Settings for live generative intelligence.",
      });
    }

    try {
      const ai = getAi();

      // Format history messages if provided
      const contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(history)) {
        for (const item of history.slice(-8)) { // Keep last 8 turns for conversational context
          if (item && item.role && (item.role === "user" || item.role === "model")) {
            const textContent = typeof item.parts === "string" 
              ? item.parts 
              : Array.isArray(item.parts) && item.parts[0]?.text 
              ? item.parts[0].text 
              : typeof item.text === "string" 
              ? item.text 
              : "";
            
            if (textContent) {
              contents.push({
                role: item.role,
                parts: [{ text: textContent }],
              });
            }
          }
        }
      }

      // Add current user message
      contents.push({
        role: "user",
        parts: [{ text: trimmedMessage }],
      });

      let replyText = "";
      let modelUsed = "gemini-3.8-flash";

      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents,
          config: {
            systemInstruction: AYUSH_SYSTEM_INSTRUCTION,
            temperature: 0.7,
          },
        });
        replyText = response.text || "";
      } catch (firstAttemptErr: any) {
        console.warn("Primary model attempt notice, trying secondary model:", firstAttemptErr.message);
        try {
          const fallbackModel = await ai.models.generateContent({
            model: "gemini-3.1-flash-lite",
            contents,
            config: {
              systemInstruction: AYUSH_SYSTEM_INSTRUCTION,
              temperature: 0.7,
            },
          });
          replyText = fallbackModel.text || "";
          modelUsed = "gemini-3.1-flash-lite";
        } catch (secondErr: any) {
          console.warn("Secondary model attempt notice:", secondErr.message);
          replyText = getFallbackResponse(trimmedMessage);
          modelUsed = "AyushSetu Advisor Knowledge Base";
        }
      }

      if (!replyText) {
        replyText = getFallbackResponse(trimmedMessage);
      }

      return res.json({
        reply: replyText,
        source: modelUsed,
      });
    } catch (genAiError: any) {
      console.error("Gemini API generation error:", genAiError);
      // Graceful fallback so user is never stranded
      const fallbackReply = getFallbackResponse(trimmedMessage);
      return res.json({
        reply: fallbackReply,
        source: "AyushSetu Advisor Knowledge Base",
        errorInfo: genAiError.message || "Model query temporarily interrupted.",
      });
    }
  } catch (error: any) {
    console.error("Server API /api/chat error:", error);
    res.status(500).json({
      error: "Failed to process chat message.",
      details: error.message || "Internal server error",
    });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AyushSetu Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
