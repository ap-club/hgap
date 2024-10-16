const pickForm = document.getElementById('pickTool');
const numTextForm = document.getElementById('numTextSearch');
const pictureForm = document.getElementById('pictureSearch');
const convertedSearch = document.getElementById('convertedSearch');
const error = document.getElementById('searchError');
const result = document.getElementById('resultBox');
const drawingTable = document.getElementById('drawing');

const alphabet = ' abcdefghijklmnopqrstuvwxyz';
const numArrsByColumn = {};

function changeView(e) {
  if (e.target.value === 'number') {
    numTextForm.classList.remove('hidden');
    pictureForm.classList.add('hidden');
  } else {
    numTextForm.classList.add('hidden');
    pictureForm.classList.remove('hidden');
  }
}

pickForm.addEventListener('change', changeView);

function toggleGridCell(e) {
  const cell = e.target;
  numArrsByColumn[cell.dataset.forNum][cell.dataset.pos] = cell.classList.contains('active') ? 0 : 1;

  if (cell.classList.contains('active')) {
    cell.classList.remove('active');
  } else {
    cell.classList.add('active');
  }
}

function setUpRepresentation() {
  const rows = Array.from(drawingTable.getElementsByTagName('tr'));
  for (let row = 0; row < rows.length; row += 1) {
    const cells = Array.from(rows[row].getElementsByTagName('td'));
    for (let col = 0; col < cells.length; col += 1) {
      cells[col].dataset.pos = row;
      cells[col].dataset.forNum = col;
      cells[col].addEventListener('click', toggleGridCell);

      if (!(col in numArrsByColumn)) numArrsByColumn[col] = Array(4).fill(0);
    }
  }
}

function getCondensedRepresentation() {
  const binaries = Object.values(numArrsByColumn)
    .map((arr) => arr.join(''));
  const decimals = binaries
    .map((binary) => parseInt(binary, 2));
  const untrimmed = decimals.join('');
  const final = untrimmed.replace(/^0+|0+$/g, '');

  return [
    `${binaries.join(' ')} --> ${decimals.join(', ')} --> ${untrimmed} --> ${final}`,
    final,
  ];
}

function submitForm(e) {
  e.preventDefault();
  error.textContent = '';
  let input;

  if (e.target.input) {
    const origInput = e.target.input.value.toLowerCase();
    let illegalChar = false;
    let hasText = false;

    const convertedArr = origInput.split('').map((char) => {
      if (Number.isNaN(Number.parseInt(char, 10))) {
        hasText = true;
        const index = alphabet.indexOf(char);

        if (index === -1) {
          illegalChar = char;
        } else {
          return index;
        }
      }
      return char;
    });
    input = convertedArr.join('');

    if (illegalChar) {
      error.textContent = `${illegalChar} is not an accepted character. Use only numbers, letters, and spaces.`;
      return;
    }

    convertedSearch.textContent = hasText ? `${origInput} --> ${convertedArr.join(', ')} --> ${input}` : input;
  } else {
    [convertedSearch.textContent, input] = getCondensedRepresentation();
  }
  e.target.submit.value = 'LOADING...';
  e.target.submit.disabled = true;

  const xhttp = new XMLHttpRequest();
  xhttp.open('GET', `./php/search_controller?data=${encodeURIComponent(input)}`);
  xhttp.send();

  xhttp.onreadystatechange = () => {
    if (xhttp.readyState === 4 && xhttp.status === 200) {
      const response = xhttp.responseText;
      result.innerHTML = response;

      if (result.getBoundingClientRect().y > window.innerHeight) {
        result.scrollIntoView(false);
      }

      e.target.submit.value = 'Search';
      e.target.submit.disabled = false;
    }
  };
}

numTextForm.addEventListener('submit', submitForm);
pictureForm.addEventListener('submit', submitForm);
setUpRepresentation();
