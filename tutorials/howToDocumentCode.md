* * *

#### How to Generate docs

To generate the document, run `npm run doc` command after changes.

* * *

#### Module

Add the below code in every module with their appropriate name and point to the tutorial (optional).
```
/**
 * ModuleName module - See {@tutorial tutorialName}
 */
 ```

* * *

#### Function

```
/**
 * This is a function.
 *
 * @param {string} n - A string param
 * @return {string} A good string //  {void} if no return statement
 *
 * @example
 *
 *     foo('hello')
 */
function foo(n) {
  return n
}
```

* * *

### Variables

```
/**
 * @type {number}
 */
var FOO = 1
/**
 * @const {number}
 */
const FOO = 1
```

* * *

### Types

```
@param {string=} n	//Optional
@param {string} [n]	//Optional
@param {(string|number)} n	//Multiple types
@param {*} n	//Any type
@param {...string} n	//Repeatable arguments
@param {string} [n="hi"]	//Optional with default
@param {string[]} n	//Array of strings
@return {Promise<string[]>} n	//Promise fulfilled by array of strings
```

* * *

### Class

```
/**
 * Class to create a person object
 */
class Person {
  /**
   *
   * @param {Object} personInfo Information about the person
   */
  constructor(personInfo) {
    /**
     * @property {string} name Persons name
     */
    this.name = personInfo.name;
    /**
     * @property {string} age Persons age
     */
    this.age = personInfo.age;
  }

  /**
   * @property {Function} greet A greeting with the name and age
   * @returns {void}
   */
  greet() {
    console.log(`Hello, my name is ${this.name} and I am ${this.age}`);
  }
}

/**
 * See {@link Person}
 */
const person1 = new Person({
  name: 'John Doe',
  age: 30
});
```

* * *

### Tutorials

* To create a tutorial, go to the tutorials folder and create a new markdown file.
* You can change the name of the tutorial in `tutorials/tutorials.json` file.

* * *

### Other Keywords

```
/**
 * @throws {FooException}
 * @private
 * @deprecated
 * @see
 *
 * @function
 * @class
 */
 ```

* * *

 ### References

 `https://devhints.io/jsdoc`
