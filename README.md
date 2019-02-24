# Tagged Number
BigNumber library extension replacing methods like `add` with symbols like `+` using tagged template strings

# Examples
```
_`(1 + 2 + 3 + 4 + 5)`
_`(1 + ${num} * 2)`
_`(100 - ${num1} / ${num2})`
```
instead of
```
new BigNumber(1).add(2).add(3).add(4).add(5)
new BigNumber(1).add(new BigNumber(num).mul(2))
new BigNumber(100).sub(new BigNumber(num1).div(num2))
```
