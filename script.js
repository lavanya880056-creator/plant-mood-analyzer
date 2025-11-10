const imageUpload = document.getElementById("imageUpload");
const preview = document.getElementById("preview");
const analyzeBtn = document.getElementById("analyzeBtn");
const output = document.getElementById("output");
const mood = document.getElementById("mood");
const message = document.getElementById("message");
const happiness = document.getElementById("happiness");
const plantImage = document.getElementById("plantImage");
const tipsBox = document.getElementById("tipsBox");
const tipsList = document.getElementById("tipsList");

const MODEL_URL = "https://teachablemachine.withgoogle.com/models/ERffnAxFX/model.json";
let model;

// Load model
window.onload = async function() {
  try {
    model = await tf.loadLayersModel(MODEL_URL);
    console.log("✅ Model loaded successfully!");
  } catch (err) {
    console.error("❌ Model loading failed:", err);
    alert("Model failed to load. Please check your link.");
  }
};

// Image preview
imageUpload.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    preview.src = URL.createObjectURL(file);
    preview.classList.remove("hidden");
  }
});

// Analyze image
analyzeBtn.addEventListener("click", async () => {
  if (!model) {
    alert("Model still loading. Please wait a few seconds.");
    return;
  }
  if (!preview.src) {
    alert("Please upload a plant image first!");
    return;
  }

  const img = tf.browser.fromPixels(preview).resizeBilinear([224, 224]).expandDims(0).div(255);
  const prediction = await model.predict(img).data();
  img.dispose();

  const labels = ["Healthy", "Dry", "Overwatered", "Diseased"];
  const maxIndex = prediction.indexOf(Math.max(...prediction));
  const label = labels[maxIndex];

  let plantMessage = "";
  let moodText = "";
  let happyPercent = 0;
  let plantSrc = "";
  let tips = [];

  switch (label) {
    case "Healthy":
      plantMessage = "I feel fresh and full of life! 🌞";
      moodText = "Thriving 🌿";
      happyPercent = 98;
      plantSrc = "https://i.imgur.com/fCSmStY.jpeg";
      tips = [
        "Maintain consistent watering schedule.",
        "Give me bright, indirect sunlight.",
        "Keep enjoying your thriving plant!"
      ];
      break;
    case "Dry":
      plantMessage = "I’m feeling dry and thirsty... 💧";
      moodText = "Thirsty 🥀";
      happyPercent = 40;
      plantSrc = "https://i.imgur.com/zOdQA8C.jpeg";
      tips = [
        "Water me a bit more regularly.",
        "Move me away from direct harsh sunlight.",
        "Mulch the soil to retain moisture."
      ];
      break;
    case "Overwatered":
      plantMessage = "Too much water! My roots need air 😥";
      moodText = "Overwatered 💦";
      happyPercent = 50;
      plantSrc = "https://i.imgur.com/UBckKg9.jpeg";
      tips = [
        "Let the soil dry before watering again.",
        "Ensure the pot has drainage holes.",
        "Avoid watering if the top soil feels moist."
      ];
      break;
    case "Diseased":
      plantMessage = "Oh no... I think I’m getting sick 🦠";
      moodText = "Diseased 😢";
      happyPercent = 25;
      plantSrc = "https://i.imgur.com/cUKXZhz.jpeg";
      tips = [
        "Trim and remove infected leaves.",
        "Avoid overhead watering.",
        "Spray with organic neem oil weekly."
      ];
      break;
  }

  mood.innerText = moodText;
  message.innerText = plantMessage;
  happiness.innerText = `Happiness Level: ${happyPercent}%`;
  output.classList.remove("hidden");

  // Update plant image
  plantImage.src = plantSrc;
  plantImage.classList.remove("hidden");

  // Update tips
  tipsList.innerHTML = "";
  tips.forEach(tip => {
    const li = document.createElement("li");
    li.textContent = tip;
    tipsList.appendChild(li);
  });
  tipsBox.classList.remove("hidden");
});
