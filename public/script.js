function analyzeMessage() {
    let text = document.getElementById("message").value.toLowerCase();
    let risk = 0;
    let reasons = [];

    if (text.includes("urgent")) {
        risk += 1;
        reasons.push("Uses urgent language");
    }
    if (text.includes("verify")) {
        risk += 1;
        reasons.push("Asks for verification");
    }
    if (text.includes("click")) {
        risk += 1;
        reasons.push("Asks you to click a link");
    }

    let level = "Low";
    if (risk == 1) level = "Medium";
    if (risk >= 2) level = "High";

    document.getElementById("result").innerText =
        "Risk Level: " + level + "\nReasons: " + reasons.join(", ");
}

function checkLink() {
    let url = document.getElementById("url").value.toLowerCase();
    let risk = 0;
    let reasons = [];

    if (url.includes("login") || url.includes("verify")) {
        risk += 1;
        reasons.push("Contains suspicious keywords");
    }
    if (url.length > 40) {
        risk += 1;
        reasons.push("URL is unusually long");
    }
    if (url.includes(".xyz") || url.includes(".top")) {
        risk += 1;
        reasons.push("Uses uncommon domain");
    }

    let level = "Low";
    if (risk == 1) level = "Medium";
    if (risk >= 2) level = "High";

    document.getElementById("linkResult").innerText =
        "Risk Level: " + level + "\nReasons: " + reasons.join(", ");
}

function calculateScore() {
    let score = 100;

    if (document.getElementById("q1").value === "yes") score -= 30;
    if (document.getElementById("q2").value === "yes") score -= 30;
    if (document.getElementById("q3").value === "no") score -= 40;

    document.getElementById("scoreResult").innerText =
        "Your Safety Score: " + score + "/100";
}
