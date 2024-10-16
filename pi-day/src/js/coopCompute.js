const digitsPerIteration = 14.1816474627;
let lastUpdate = 0;
let workInProgress;
let token;

const workButton = document.getElementById('getWork');
const statusP = document.getElementById('status');
const totalDigits = document.getElementById('totalDigits');
const totalTerms = document.getElementById('totalTerms');
const personalDigits = document.getElementById('personalDigits');
const personalTerms = document.getElementById('personalTerms');

// Chudnovsky algorithm for calculating Pi.
// Guy Fernando (2019)

function factorial(n) {
  let r;
  try {
    let i = 2;
    r = new Decimal(1);
    for (; i <= n; r = r.times(i++)) ;
  } catch (err) {
    console.log(err.message);
  }

  return r;
}

function chudnovskySeriesPart(start, end) {
  const digits = Math.floor((end - start) * digitsPerIteration);
  Decimal.precision = digits + 2;

  let partSum = new Decimal(0);
  let Mk; let Lk; let Xk;

  for (let k = start; k < end + 1; k += 1) {
    // Multinomial term, Mk = (6k)! / (3k)! * (6k)!^3
    Mk = Decimal(factorial(6 * k))
      .div(Decimal(factorial(3 * k)).times(Decimal(factorial(k)).pow(3)));

    // Linear term, Lk = 545140134k + 13591409
    Lk = Decimal(545140134 * k).plus(13591409);

    // Exponential term, Xk = -262537412640768000^k
    Xk = Decimal(-262537412640768000).pow(k);

    // Pi series partial summation.
    partSum = partSum.plus(Mk.times(Lk).div(Xk));
  }

  return partSum;
}

// factorial() and chudnovskySeriesPart() adapted from:
// https://www.i4cy.com/pi/

function setCookie(name, value, days) {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${value || ''}${expires}; path=/`;
}

function getCookie(name) {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i += 1) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function updateCounts(data) {
  totalTerms.textContent = `(${data.totalTerms.toLocaleString('en-US')} terms)`;
  personalTerms.textContent = `(${data.personalTerms.toLocaleString('en-US')} terms)`;
  totalDigits.textContent = Math.floor(data.totalTerms * digitsPerIteration).toLocaleString('en-US');
  personalDigits.textContent = Math.floor(data.personalTerms * digitsPerIteration).toLocaleString('en-US');
  lastUpdate = Date.now();
}

function request(type, callback, qsValue) {
  const xhttp = new XMLHttpRequest();
  xhttp.open('POST', './php/work_controller');
  xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhttp.send(`${type}=${qsValue || 'true'}&clientToken=${token}`);

  xhttp.onreadystatechange = () => {
    if (xhttp.readyState === 4 && xhttp.status === 200) {
      callback(JSON.parse(xhttp.responseText));
    }
  };
}

function initiateUser() {
  token = getCookie('clientToken');
  if (!token) {
    const randAlphaNum = Array.from(Array(10), () => Math.floor(Math.random() * 36).toString(36)).join('');
    setCookie('clientToken', randAlphaNum, 365);
    token = randAlphaNum;
  }

  request('statUpdate', updateCounts);
}
initiateUser();

workButton.onclick = () => {
  if (workInProgress) return;
  workInProgress = true;
  workButton.disabled = true;
  statusP.textContent = 'STATUS: Requesting work...';

  request('getWork', async (data) => {
    statusP.textContent = `STATUS: Calculating term # ${data.start} to ${data.end}...`;

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(chudnovskySeriesPart(data.start, data.end));
      }, 500);
    });

    statusP.textContent = 'STATUS: Submitting work...';
    request('submitWork', (data2) => {
      updateCounts(data2);
      statusP.textContent = 'STATUS: Done.';
      workInProgress = false;
      workButton.disabled = false;
    }, data.start);
  });
};

setInterval(() => {
  if (Date.now() - lastUpdate > 30) {
    request('statUpdate', updateCounts);
  }
}, 60000);
