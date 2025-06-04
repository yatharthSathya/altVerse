// Map topic IDs to readable names and CSS classes for styling
const topicNames = {
    "columbian-exchange": "the Columbian Exchange",
    "salem-witch-trials": "the Salem Witch Trials",
    "declaration-independence": "the Declaration of Independence",
    "missouri-compromise": "the Missouri Compromise",
    "emancipation-proclamation": "the Emancipation Proclamation",
    "wctu": "the Women’s Christian Temperance Union (WCTU)",
    "cuban-missile-crisis": "the Cuban Missile Crisis"
  };
  
  const topicClassMap = {
    "columbian-exchange": "columbian-exchange",
    "salem-witch-trials": "salem-witch-trials",
    "declaration-independence": "declaration-independence",
    "missouri-compromise": "missouri-compromise",
    "emancipation-proclamation": "emancipation-proclamation",
    "wctu": "wctu",
    "cuban-missile-crisis": "cuban-missile-crisis"
  };
  
  // When user clicks "Generate Scenario"
  document.getElementById("generate").addEventListener("click", async () => {
    const topic = document.getElementById("topic").value;
    const whatIf = document.getElementById("whatif").value.trim();
    const resultArea = document.getElementById("result");
    const speakBtn = document.getElementById("speak-btn");
  
    if (!whatIf) {
      resultArea.textContent = "Please enter a 'What if...' scenario.";
      speakBtn.style.display = "none"; // Hide speak button
      resultArea.className = ""; // Remove any topic classes
      return;
    }
  
    resultArea.textContent = "Generating alternate universe...";
    speakBtn.style.display = "none"; // Hide speak button while loading
    resultArea.className = ""; // Clear previous classes
  
    try {
      const scenario = await getAlternateHistory(topic, whatIf);
  
      // Apply CSS class for the topic to style resultArea
      const cssClass = topicClassMap[topic] || "";
      if (cssClass) resultArea.classList.add(cssClass);
  
      // Convert the scenario text into a numbered HTML list
      const lines = scenario.split(/\n+/).filter(line => line.trim().length > 0);
      const listItems = lines.map(line => {
        // Remove any leading numbers and dots from OpenAI output lines
        const cleanText = line.replace(/^\d+\.\s*/, '');
        return `<li>${cleanText}</li>`;
      }).join('');
  
      resultArea.innerHTML = `<ol>${listItems}</ol>`;
  
      // Show speak button after text is ready
      speakBtn.style.display = "inline-block";
      speakBtn.dataset.text = scenario;  // Save scenario text on button for speech
    } catch (error) {
      resultArea.textContent = "Error: " + error.message;
      speakBtn.style.display = "none";
      resultArea.className = ""; // Remove classes on error
    }
  });
  
  // When user clicks "Speak" button
  document.getElementById("speak-btn").addEventListener("click", () => {
    const speakBtn = document.getElementById("speak-btn");
    const text = speakBtn.dataset.text;
    if (!text) return;
  
    if (!window.speechSynthesis) {
      alert("Sorry, your browser does not support speech synthesis.");
      return;
    }
  
    const utter = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utter);
  });
  
  // Calls OpenAI API to get alternate history text
  async function getAlternateHistory(topic, whatIf) {
    const apiKey = "";  // <-- Replace with your OpenAI API key
  
    const topicReadable = topicNames[topic] || topic;
  
    const systemPrompt = `You are a creative storyteller specializing in U.S. history for APUSH students. Write short, engaging, and informative bullet points for alternate history.`;
  
    const userPrompt = `
  Imagine an alternate history scenario where ${whatIf} involving ${topicReadable}.
  Write ten clear, concise bullet points in a numbered list summarizing this alternate history.
  Make it suitable for high school APUSH students.
  `;
  
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.5,
        max_tokens: 450
      })
    });
  
    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`OpenAI API error: ${errorDetails}`);
    }
  
    const data = await response.json();
    return data.choices[0].message.content.trim();
  }
// Ensure the speak button is initially hidden
document.getElementById("speak-btn").style.display = "none";  

document.getElementById("toggle-responsive").addEventListener("click", () => {
    const body = document.body;
    const btn = document.getElementById("toggle-responsive");
  
    body.classList.toggle("mobile-friendly");
  
    if (body.classList.contains("mobile-friendly")) {
      btn.textContent = "Disable Mobile-Friendly Mode";
    } else {
      btn.textContent = "Enable Mobile-Friendly Mode";
    }
  });
// Ensure the initial state of the body is not mobile-friendly
document.body.classList.remove("mobile-friendly");  
