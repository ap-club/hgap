const Decimal = require('../lib/decimal.js');

const digitsPerIteration = 14.1816474627;

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

  for (let k = start; k < end + 1; k++) {
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

console.log(chudnovskySeriesPart(10000, 10100));
