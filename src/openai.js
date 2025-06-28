export async function generateSummary(formData) {
    const prompt = `
  You are a helpful assistant. Generate a short, professional invoice summary from this data:
  
  Client: ${formData.clientName}
  Service: ${formData.service}
  Amount: ${formData.amount}
  Due Date: ${formData.dueDate}
  Notes: ${formData.notes || "None"}
  
  Return a 2-3 sentence summary suitable for including at the top of an invoice.
    `;
  
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.REACT_APP_OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://smartinvoicer.vercel.app/",
            "X-Title": "Smart Invoicer",
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct",
            messages: [{ role: "user", content: prompt }],
        }),
      });
  
      const data = await response.json();
  
      if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content.trim();
      } else {
        throw new Error("No response from OpenAI");
      }
    } catch (error) {
      console.error("Error generating summary:", error);
      return "Error generating summary.";
    }
  }
  