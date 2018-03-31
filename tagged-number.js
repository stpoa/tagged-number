const BigNumber = require('bignumber.js');
const R = require('ramda');


// Helpers
const { flatten, zip } = R;

const last = arr => arr[arr.length > 0 ? arr.length - 1 : 0];

const flat = arr =>
	arr.reduce((acc, v) => (Array.isArray(v) ? [...acc, ...v] : [...acc, v]), []);

const flatMap = (fn, arr) => flat(arr).map(fn);

const replace = (map, input) =>
	Object.entries(map).reduce(
		(acc, [key, val], to) => acc.replace(
		  new RegExp(key.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"), 'g'),
		  val
		), input
	);

function getMatchinTags(tagA, tagB, arr) {
  if (arr.indexOf(tagA) === -1) {
    return [[]];
  }

	const stackA = [];
	const stackB = [];
	const result = [];

	let k = 0;
	let l = 1;
	while (k < arr.length && l < arr.length) {
		const indexA = arr.indexOf(tagA, k);
    const indexB = arr.indexOf(tagB, l);

    if (indexA === -1 && indexB === -1) {
      break;
    }
		if (indexA !== -1) {
			stackA.push(indexA);
			k = indexA + 1;
		} 
		if (indexB !== -1) {
			stackB.push(indexB);
			result.push([stackA.pop(), stackB.pop()]);
			l = indexB + 1;
		} 
	}
	return result;
}


// Main
function _(strings, ...values) {
	const operators = {
		'+': 'plus',
		'-': 'minus',
		'*': 'times',
		'/': 'div'
	};
	const orderedOperators = ['*', '/', '-', '+'];
	const operatorsWithSpaces = [...orderedOperators, '(', ')'].reduce((acc, o) => {
		acc[o] = ` ${o} `;
		return acc;
	}, {});

	function parse (strings, values) {
		const zipped = R.zip(strings, values);
    const merged = strings.length > values.length
    ? [...zipped, [last(strings), '']]
    : zipped;
		const splitted = merged.map(
	 	  pair => [replace(operatorsWithSpaces, pair[0]).replace('e +', 'e+').split(' '), pair[1]]
		);
		return flatten(splitted).filter(e => e !== '');
	}

  function calculate(arr) {
    if (arr.length === 1) {
      return arr[0];
    } else {
      [braceOpenIndex, braceCloseIndex] = last(getMatchinTags('(', ')', arr));
  
      if (braceCloseIndex) {
        const beggining = arr.slice(0, braceOpenIndex);
        const mid = arr.slice(braceOpenIndex + 1, braceCloseIndex);
        const end = arr.slice(braceCloseIndex + 1);
  
        return calculate([...beggining, calculate(mid), ...end]);
      } else {
        return orderedOperators.reduce((result, operatorSymbol) => {
          const index = arr.indexOf(operatorSymbol);
          if (result instanceof BigNumber || index === -1) {
            return result;
          }
          const a = new BigNumber(arr[index - 1]);
          const o = operators[operatorSymbol];
          const b = new BigNumber(arr[index + 1]);
          const beggining = arr.slice(0, index - 1);
          const calculated = (a)[o](b);
          const end = arr.slice(index + 2);
  
          return calculate([...beggining, calculated, ...end]);
        }, {});
      }
    }
  }
  const parsed = parse(strings, values)
	return calculate(parsed);
}

module.exports = _;