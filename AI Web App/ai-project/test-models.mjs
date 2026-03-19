const apiKey = "AIzaSyDZr_AAo_2SjtxGQUzUNzliBXjDIG6eAbM";
async function run() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    console.log("AVAILABLE MODELS:");
    if (data.models) {
        console.log(data.models.map(m => m.name));
    } else {
        console.log(data);
    }
  } catch (e) {
    console.log("ERROR", e);
  }
}
run();
