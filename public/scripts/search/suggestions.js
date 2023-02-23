const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");
const suggestionsDiv = document.querySelector("#suggestions");
const suggestionsList = document.querySelector("#suggestions-list");

searchInput.addEventListener("input", (event) => {
  cleanList(suggestionsList);

  suggestionsDiv.classList.remove("d-none");

  fetchData(searchInput.value).then(function (result) {
    const suggestions = result.features;

    renderSuggestion(suggestions);

    // suggestionsDiv.addEventListener("click", (event) => {
    //   const target = event.target;
    //   console.log(target);
    // });
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
    const a = document.createElement("a");
    a.classList.add("list-group-item", "list-link");
    a.innerText = suggestion.place_name;
    a.coordinates = suggestion.geometry.coordinates;
    suggestionsList.appendChild(a);
  }
}

function cleanList(list) {
  let child = list.lastElementChild;

  while (child) {
    list.removeChild(child);
    child = list.lastElementChild;
  }
}

function searchHandler() {
  const value = form.elements[0].value;
  const data = fetchData(value);
  data.then((result) => {
    console.log(result.features[0].geometry.coordinates);
    map.flyTo({
      center: result.features[0].geometry.coordinates,
      zoom: 10,
    });
  });
}
