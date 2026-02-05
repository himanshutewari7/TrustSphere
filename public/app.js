const API = "";

/* ---------------- TRUSTLENS ---------------- */
async function analyzeMessage() {
  const text = document.getElementById("messageInput").value;
  const res = await fetch("/api/analyze-message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text })
  });

  const data = await res.json();
  displayResult(data, "trustlensResult");
}

/* ---------------- LINK CHECKER ---------------- */
async function checkLink() {
  const url = document.getElementById("urlInput").value;
  const res = await fetch("/api/check-link", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url })
  });

  const data = await res.json();
  displayResult(data, "linkResult");
}

/* ---------------- SHIELD ---------------- */
async function calculateScore() {
  const answers = {
    passwordReuse: document.getElementById("q1").checked,
    publicWifi: document.getElementById("q2").checked,
    twoFA: document.getElementById("q3").checked,
    unknownApps: document.getElementById("q4").checked,
    shareOTP: document.getElementById("q5").checked
  };

  const res = await fetch("/api/safety-score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers })
  });

  const data = await res.json();

  document.getElementById("score").innerText = data.score;

  document.getElementById("shieldResult").innerHTML = `
    <p class="mt-2">${data.summary}</p>
    <h4 class="mt-4 font-semibold">Top Improvements</h4>
    <ul>${data.improvements.map(i => `<li>• ${i}</li>`).join("")}</ul>
    <h4 class="mt-4 font-semibold">Quick Tips</h4>
    <ul>${data.quickTips.map(i => `<li>• ${i}</li>`).join("")}</ul>
  `;
}

/* ---------------- COMMON RESULT UI ---------------- */
function displayResult(data, elementId) {
  const el = document.getElementById(elementId);

  let items = "";
  if (data.reasons) {
    items = data.reasons.map(r => `<li>• ${r}</li>`).join("");
  } else if (data.indicators) {
    items = data.indicators.map(r => `<li>• ${r}</li>`).join("");
  }

  el.innerHTML = `
    <div class="badge ${data.risk.toLowerCase()}">${data.risk} Risk</div>
    <ul class="mt-3">${items}</ul>
  `;
}
