/**
 * Small Program
 *
 * Rules:
 * 1. Create an array of numbers from 1 to 100.
 * 2. Print all these numbers in reverse order:
 *    - Do not print prime numbers.
 *    - Replace numbers divisible by 3 with "Foo".
 *    - Replace numbers divisible by 5 with "Bar".
 *    - Replace numbers divisible by both 3 and 5 with "FooBar".
 *    - Print horizontally.
 */

function isPrime(num) {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}

// 1. Create an array of numbers from 1 to 100
const numbers = [];
for (let i = 1; i <= 100; i++) {
  numbers.push(i);
}

// 2. Process in reverse order
const output = [];
for (let i = numbers.length - 1; i >= 0; i--) {
  const num = numbers[i];

  // Do not print prime numbers
  if (isPrime(num)) {
    continue;
  }

  // Divisible by both 3 and 5 -> FooBar
  if (num % 3 === 0 && num % 5 === 0) {
    output.push("FooBar");
  }
  // Divisible by 3 -> Foo
  else if (num % 3 === 0) {
    output.push("Foo");
  }
  // Divisible by 5 -> Bar
  else if (num % 5 === 0) {
    output.push("Bar");
  }
  // Normal number
  else {
    output.push(num);
  }
}

// Print horizontally matching the example format (with trailing comma and space)
process.stdout.write(output.join(", ") + ", ");
