const {calculateFantasyPoints} = require('./dist/lib.js')

console.log(calculateFantasyPoints({
  priceDifference: -51,
  marketCapDifference: -51,
  volumeDifference: 28
}));
