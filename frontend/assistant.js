document.addEventListener("DOMContentLoaded", () => {
  const assistantForm = document.getElementById("assistantForm");
  const assistantMessage = document.getElementById("assistantMessage");
  const assistantChat = document.getElementById("assistantChat");
  const assistantStatus = document.getElementById("assistantStatus");

  const addChatMessage = (text, sender) => {
    const bubble = document.createElement("div");
    bubble.className = sender === "assistant" ? "chat bot" : "chat user";
    bubble.innerText = text;
    assistantChat.appendChild(bubble);
    assistantChat.scrollTop = assistantChat.scrollHeight;
  };

  const setStatus = (message, isError = false) => {
    assistantStatus.innerText = message;
    assistantStatus.style.color = isError ? "#c0392b" : "#2e7d32";
  };

  const setTyping = (active) => {
    let typing = document.getElementById("typingIndicator");
    if (active) {
      if (!typing) {
        typing = document.createElement("div");
        typing.id = "typingIndicator";
        typing.className = "typing-indicator";
        typing.innerHTML = '<span></span><span></span><span></span> Krishi AI tayyar ho raha hai...';
        assistantChat.appendChild(typing);
        assistantChat.scrollTop = assistantChat.scrollHeight;
      }
    } else if (typing) {
      typing.remove();
    }
  };

  const showWelcome = () => {
    assistantChat.innerHTML = "";
    addChatMessage(
      "Namaste! Main Krishi AI hun. Aap apne kheti se related sawal pooch sakte hain.",
      "assistant"
    );
    setStatus("AI assistant ready. Aapka sawal likhiye.", false);
  };

  if (!assistantForm || !assistantMessage || !assistantChat || !assistantStatus) {
    document.body.innerHTML = "<div style='padding:32px; color:#2d5016; font-size:18px;'>Assistant page failed to load correctly. Please check your files.</div>";
    return;
  }

  showWelcome();

  assistantForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = assistantMessage.value.trim();

    if (!message) {
      setStatus("Kripya sawal likhe.", true);
      return;
    }

    addChatMessage(message, "user");
    assistantMessage.value = "";
    setStatus("Krishi AI se jawab aa raha hai...", false);
    setTyping(true);

    try {
      const response = await fetch(getApiUrl("/api/ai-assistant"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      setTyping(false);

      if (!response.ok) {
        let errorData = {};
        try {
          errorData = await response.json();
        } catch (_err) {
          // ignore parse errors
        }
        throw new Error(errorData.detail || "Server kabhi-kabhi busy rehta hai.");
      }

      const data = await response.json();
      addChatMessage(data.reply || "Krishi AI ko jawab dhoondhne me dikkat hui.", "assistant");
      setStatus("Jawab mil gaya. Neeche dekhein.", false);
    } catch (error) {
      setTyping(false);
      setStatus(error.message || "AI assistant service unavailable.", true);
      addChatMessage(
        "Krishi AI se jawab abhi available nahi hai. Kripya thodi der baad phir koshish karein.",
        "assistant"
      );
    }
  });

  assistantMessage.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      assistantForm.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
    }
  });
});
