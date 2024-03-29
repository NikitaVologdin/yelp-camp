const searchInput = document.querySelector("#searchInput");
const suggestionsDiv = document.querySelector("#suggestions");
const suggestionsList = document.querySelector("#suggestions-list");

searchInput.addEventListener("input", (event) => {
  if (suggestionsList.children.length > 0) {
    cleanList(suggestionsList);
  }

  if (suggestionsDiv.classList.contains("d-none")) {
    suggestionsDiv.classList.remove("d-none");
  }

  fetchData(searchInput.value).then(function (result) {
    const suggestions = result.features;

    renderSuggestion(suggestions);
  });
});

suggestionsList.addEventListener("click", (event) => {
  const target = event.target;
  searchInput.value = target.innerText;
  searchInput.coordinates = target.coordinates;
  suggestionsDiv.classList.add("d-none");
  searchHandler();
});

async function fetchData(value) {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${value}.json?limit=3&access_token=${mapToken}`;

  let response = await fetch(url);
  let json = await response.json();
  return json;
}

function renderSuggestion(suggestions) {
  for (let suggestion of suggestions) {
    const li = document.createElement("li");
    li.classList.add("list-group-item", "list-link");
    li.innerText = suggestion.place_name;
    li.coordinates = suggestion.geometry.coordinates;
    suggestionsList.appendChild(li);
  }
}

function cleanList(list) {
  let child = list.lastElementChild;

  while (child) {
    list.removeChild(child);
    child = list.lastElementChild;
  }
}
