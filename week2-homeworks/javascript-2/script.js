/*Collatz uzunluğunu hesaplayan fonksiyon-
Hesaplanan değerleri cache içinde tutarak her sayının tekrar tekrar hesaplamasını 
engellemek için bu yöntemi kullandım.*/

let cache = {};

function collatzLength(n) {
  if (cache[n]) return cache[n];

  let count = 1;
  let original = n;

  while (n >= 1) {
    if (n % 2 === 0) {
      n = n / 2;
    } else {
      n = 3 * n + 1;
    }

    if (cache[n]) {
      count += cache[n];
      break;
    }

    count++;
  }

  cache[original] = count;
  return count;
}

// herhangi bir sayı ile dönen dizi sayısı

let n = parseInt(prompt("Bir doğal sayı giriniz!!"), 10);
if (isNaN(n) || n < 1) {
  alert("Lütfen geçerli bir doğal sayı giriniz!");
} else {
  let result = collatzLength(n);
  alert(`Girdiğiniz sayı: ${n} | Adım sayısı: ${result} `);

  console.log(`Girdiğiniz sayı: ${n} | Adım sayısı: ${result} `);
}

//En uzun Collatz zinciri bulma

const LIMIT = 1000000;

function longestCollatz(limit) {
  let maxCount = 0;
  let startingNumber = 0;

  for (let i = 1; i < limit; i++) {
    let countLength = collatzLength(i);

    if (countLength > maxCount) {
      maxCount = countLength;
      startingNumber = i;
    }
  }

  console.log(
    `En uzun Collatz zinciri: ${maxCount}, Başlangıç sayısı: ${startingNumber}`
  );
  return { maxCount, startingNumber };
}


let result = longestCollatz(LIMIT);
alert(
  `En uzun Collatz zinciri: ${result.maxCount} | Başlangıç sayısı: ${result.startingNumber}`
);
