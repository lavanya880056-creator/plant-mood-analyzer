const imageUpload = document.getElementById("imageUpload");
const preview = document.getElementById("preview");
const analyzeBtn = document.getElementById("analyzeBtn");
const output = document.getElementById("output");
const mood = document.getElementById("mood");
const message = document.getElementById("message");
const happiness = document.getElementById("happiness");

const MODEL_URL = "https://teachablemachine.withgoogle.com/models/ERffnAxFX/model.json";
let model;

// Load model on page load
window.onload = async function() {
  try {
    model = await tf.loadLayersModel(MODEL_URL);
    console.log("✅ Model loaded successfully!");
  } catch (err) {
    console.error("❌ Model loading failed:", err);
    alert("Model failed to load. Please recheck your link.");
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

  switch (label) {
    case "Healthy":
      plantMessage = "I feel fresh and full of life! 🌞";
      moodText = "Thriving 🌿";
      happyPercent = 98;
      break;
    case "Dry":
      plantMessage = "I’m feeling dry and thirsty... 💧";
      moodText = "Thirsty 🥀";
      happyPercent = 40;
      break;
    case "Overwatered":
      plantMessage = "Too much water! My roots need air 😥";
      moodText = "Overwatered 💦";
      happyPercent = 50;
      break;
    case "Diseased":
      plantMessage = "Oh no... I think I’m getting sick 🦠";
      moodText = "Diseased 😢";
      happyPercent = 25;
      break;
  }

  mood.innerText = moodText;
  message.innerText = plantMessage;
  happiness.innerText = `Happiness Level: ${happyPercent}%`;
  output.classList.remove("hidden");
});
