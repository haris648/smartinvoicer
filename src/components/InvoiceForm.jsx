import React, { useState } from "react";
import axios from "axios";

const InvoiceForm = ({ onGenerated }) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const generateInvoice = async () => {
    if (!input.trim()) {
      alert("Please enter invoice details.");
      return;
    }

    setLoading(true);
    try {
      const prompt = `
You will be given one line of text describing an invoice.  
Always extract these fields and calculate values:

• client: string  
• service: string  
• rate: number (per hour)  
• hours: number  
• tax: number (percent)  

Then compute:  
subtotal = rate * hours  
taxAmount = subtotal * (tax / 100)  
total = subtotal + taxAmount  

Return **only** a single JSON object (no commentary) in this exact format:  
{"client":"","service":"","rate":0,"hours":0,"tax":0,"subtotal":0,"taxAmount":0,"total":0}

Text: ${input}
      `.trim();

      const { data } = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "mistralai/mistral-7b-instruct",
          messages: [{ role: "user", content: prompt }],
          temperature: 0,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://smartinvoicer.vercel.app",
            "X-Title": "Smart Invoicer",
          },
        }
      );

      const raw = data.choices?.[0]?.message?.content?.trim();
      console.log("Model output:", raw);

      // Try to parse JSON directly
      let parsed = null;
      try {
        parsed = JSON.parse(raw);
      } catch (parseErr) {
        console.error("JSON parse error:", parseErr);
        throw new Error("Failed to parse JSON from model output.");
      }

      // Fallback in case model omitted any calculation
      if (typeof parsed.rate !== "number" || typeof parsed.hours !== "number") {
        throw new Error("Missing rate or hours in parsed result.");
      }
      parsed.subtotal = parsed.subtotal ?? parsed.rate * parsed.hours;
      parsed.taxAmount = parsed.taxAmount ?? parsed.subtotal * (parsed.tax / 100);
      parsed.total = parsed.total ?? parsed.subtotal + parsed.taxAmount;

      onGenerated(parsed);
    } catch (err) {
      console.error("GenerateInvoice error:", err);
      alert(
        "Could not generate invoice. Try rephrasing (e.g., “Bill John for 3 hours of web development at $40/hr, include 10% tax.”) or check your API key."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <textarea
        className="w-full p-4 border rounded-lg"
        rows={4}
        placeholder="e.g., Bill John for 3 hours of web development at $40/hr, include 10% tax"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        onClick={generateInvoice}
        disabled={loading}
        className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Invoice"}
      </button>
    </div>
  );
};

export default InvoiceForm;
