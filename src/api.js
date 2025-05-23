export async function playRPS(choice) {
  const url = `https://rock-paper-scissors13.p.rapidapi.com/?choice=${choice}`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "efb02353e8msh12998c371346153p13d193jsnf3c188326c80",
      "x-rapidapi-host": "rock-paper-scissors13.p.rapidapi.com",
    },
  };
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error("API request failed");
  }
  return response.json();
}
