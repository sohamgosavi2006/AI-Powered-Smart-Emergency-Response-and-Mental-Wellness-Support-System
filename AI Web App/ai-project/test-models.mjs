const apiKey = "";
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
