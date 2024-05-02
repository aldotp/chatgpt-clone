const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");

let userText = null;
const API_KEY = "ASD";

const loadDataFromLocalStorage = () => {
  const themeColor = localStorage.getItem("theme-color");
  document.body.classList.toggle("light-mode", themeColor === "light_mode");
  themeButton.innerText = document.body.classList.contains("light-mode")
    ? "dark_mode"
    : "light_mode";

  const defaultText = `
  <div class="default-text">
    <h1>ChatGPT Clone</h1>
    <p>Start a conversation and explore the power of AI. <br> Your chat history will be displayed here</p>
  </div>
  `;

  chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
};

loadDataFromLocalStorage();

const createElement = (html, className) => {
  // Create new div and apply chat, specified class and set html content of div
  const chatDiv = document.createElement("div");
  chatDiv.classList.add("chat", className);
  chatDiv.innerHTML = html;
  return chatDiv;
};

const getChatResponse = async (incomingChatDiv) => {
  const API_URL = "https://api.openai.com/v1/completions";
  const pElement = document.createElement("p");

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo-16k-0613",
      prompt: userText,
      max_tokens: 2,
      temperature: 0,
      n: 1,
      stop: null,
    }),
  };

  try {
    const response = await fetch(API_URL, requestOptions);
    console.log(response);
    pElement.textContent = response.choices[0].text.trim();
  } catch (err) {
    pElement.classList.add("error");
    pElement.textContent =
      "Oops! Something went wrong while retrieving the response. Please try again.";
  }

  incomingChatDiv.querySelector(".typing-animation").remove();
  incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
  localStorage.setItem("all-chats", chatContainer.innerHTML);
};

const copyResponse = (copyBtn) => {
  // Copy the text content of the response to the clipboard
  const responsetTextElement = copyBtn.parentElement.querySelector("p");
  navigator.clipboard.writeText(responsetTextElement.textContent);
  copyBtn.textContent = "done";
  setTimeout(() => {
    copyBtn.textContent = "content_copy";
  }, 1000);
};

const showTypingAnimation = () => {
  const html = `
    <div class="chat-content">
        <div class="chat-details">
            <img src="images/chatbot.jpg" alt="chabot-img" />
            <div class="typing-animation">
                <div class="typing-dot" style="--delay: 0.2s"></div>
                <div class="typing-dot" style="--delay: 0.2s"></div>
                <div class="typing-dot" style="--delay: 0.2s"></div>
            </div>
        </div>
        <span onclick="copyResponse(this)" class="material-symbols-rounded">content_copy</span>
    </div>  
`;

  // Create an incoming chat div with typing animation and append it to chat container
  const incomingChatDiv = createElement(html, "incoming");
  chatContainer.appendChild(incomingChatDiv);
  getChatResponse(incomingChatDiv);
};

// Function to handle sending the chat
const sendChat = () => {
  handleOutgoingChat();
};

const handleOutgoingChat = () => {
  userText = chatInput.value.trim(); // Get chatInput value and remove extra spaces
  if (!userText) return;

  const html = `
    <div class="chat-content">
        <div class="chat-details">
            <img src="images/user.jpg" alt="user-img" />
            <p>${userText}</p>
        </div>
    </div>
  `;

  const outgoingChatDiv = createElement(html, "outgoing");
  outgoingChatDiv.querySelector("p").textContent = userText; // Corrected typo: textContent
  document.querySelector(".default-text")?.remove();

  chatContainer.appendChild(outgoingChatDiv);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  setTimeout(showTypingAnimation, 500);

  // Clear the input field after sending
  chatInput.value = "";
};

themeButton.addEventListener("click", () => {
  // Toogle body's class for theme mode
  document.body.classList.toggle("light-mode");
  localStorage.setItem("theme-color", themeButton.innerText);
  themeButton.innerText = document.body.classList.contains("light-mode")
    ? "dark_mode"
    : "light_mode";
});

deleteButton.addEventListener("click", () => {
  // Remove the chat container and all chats
  if (confirm("Are you sure you want to delete all chats?")) {
    localStorage.removeItem("all-chats");
    loadDataFromLocalStorage();
  }
});

const initialHeight = chatInput.scrollHeight;

chatInput.addEventListener("input", (e) => {
  chatInput.style.height = `${initialHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

sendButton.addEventListener("click", sendChat);

sendButton.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendChat();
  }
});
