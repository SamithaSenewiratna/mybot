document.getElementById("send-btn").addEventListener("click", sendMessage);

function sendMessage() {
    const userInput = document.getElementById("user-input").value.trim();
    if (!userInput) return;

    addMessage("user", userInput);
    callAIModel(userInput);

    document.getElementById("user-input").value = "";
}

function addMessage(sender, message) {
    const chatBox = document.getElementById("chat-box");
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${sender}`;
    messageDiv.innerText = message;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function callAIModel(userInput) {
    const myHeaders = new Headers({ "Content-Type": "application/json" });

    const raw = JSON.stringify({
        contents: [
            {
                parts: [{ text: userInput }]
            }
        ]
    });

    fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyD5gaqNruHjDMPmTK6ag2RMM7MtrmpoZvQ",
        { method: "POST", headers: myHeaders, body: raw }
    )
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
            return response.json();
        })
        .then(result => {
            const aiResponse =
                result?.candidates?.[0]?.content?.parts?.[0]?.text ||
                "I didn't understand that. Can you please clarify?";
            addMessage("ai", aiResponse);
        })
        .catch(error => {
            console.error("Fetch Error:", error);
            addMessage("ai", "Oops! Something went wrong. Please try again.");
        });
}
