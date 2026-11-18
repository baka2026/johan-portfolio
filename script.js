(() => {
  const $ = (selector) => document.querySelector(selector);
  const progress = $("#scrollProgress");
  const menuToggle = $("#menuToggle");
  const nav = $(".main-nav");
  const chatPanel = $("#chatPanel");
  const chatLauncher = $("#chatLauncher");
  const chatClose = $("#chatClose");
  const chatForm = $("#chatForm");
  const chatInput = $("#chatInput");
  const chatMessages = $("#chatMessages");
  const toast = $("#toast");
  let history = [];
  let busy = false;

  window.addEventListener("scroll", () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  }, { passive: true });

  menuToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  function toggleChat(open) {
    chatPanel.classList.toggle("open", open);
    chatPanel.setAttribute("aria-hidden", String(!open));
    if (open) setTimeout(() => chatInput.focus(), 100);
  }
  chatLauncher.addEventListener("click", () => toggleChat(true));
  chatClose.addEventListener("click", () => toggleChat(false));

  function addMessage(role, text) {
    const wrap = document.createElement("div");
    wrap.className = `message ${role === "user" ? "user-message" : "assistant-message"}`;
    const label = document.createElement("span");
    label.className = "message-label";
    label.textContent = role === "user" ? "YOU" : "J.A.R.V.I.S.";
    const p = document.createElement("p");
    p.textContent = text;
    wrap.append(label, p);
    chatMessages.append(wrap);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return p;
  }

  async function sendMessage(message) {
    const clean = message.trim();
    if (!clean || busy) return;
    busy = true;
    addMessage("user", clean);
    chatInput.value = "";
    const pending = addMessage("assistant", "Thinking...");
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: clean, history })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "The assistant is unavailable right now.");
      const answer = data.reply || "I couldn't generate a response. Please try again.";
      pending.textContent = answer;
      history.push({ role: "user", content: clean }, { role: "assistant", content: answer });
      history = history.slice(-12);
    } catch (error) {
      pending.textContent = error.message || "Something went wrong. Please try again.";
    } finally {
      busy = false;
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  chatForm.addEventListener("submit", event => {
    event.preventDefault();
    sendMessage(chatInput.value);
  });
  document.querySelectorAll(".chat-suggestions button").forEach(button => {
    button.addEventListener("click", () => sendMessage(button.dataset.prompt || ""));
  });

  // Keep the assistant focused on public portfolio information, not private data.
  const toastMessage = "Update this placeholder with your real details before launch.";
  document.querySelectorAll('a[href="#contact"]').forEach(link => {
    if (link.classList.contains("project-visual")) {
      link.addEventListener("click", event => {
        event.preventDefault();
        const message = link.getAttribute("aria-label") || "I'd like to discuss a project.";
        sendMessage(message);
        toggleChat(true);
      });
    }
  });
})();