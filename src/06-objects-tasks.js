/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea() {
      return this.width * this.height;
    },
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  Object.setPrototypeOf(obj, proto);
  return obj;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {

  element(value) {
    const obj = {
      errorFirst: 'Element, id and pseudo-element should not occur more then one time inside the selector',
      errorSecond: 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      elementResult: undefined,
      idResult: undefined,
      classResult: [],
      attrResult: [],
      pseudoClassResult: [],
      pseudoElementResult: undefined,
      combineResult: undefined,
      element(value1) {
        if (this.elementResult !== undefined) throw Error(this.errorFirst);
        if (this.idResult !== undefined) {
          throw Error(this.errorSecond);
        } else if (this.classResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.attrResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.pseudoClassResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.pseudoElementResult !== undefined) {
          throw Error(this.errorSecond);
        }
        this.elementResult = value1;
        return this;
      },
      id(value1) {
        if (this.idResult !== undefined) throw Error(this.errorFirst);
        if (this.classResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.attrResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.pseudoClassResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.pseudoElementResult !== undefined) {
          throw Error(this.errorSecond);
        }
        this.idResult = `#${value1}`;
        return this;
      },

      class(value1) {
        if (this.attrResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.pseudoClassResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.pseudoElementResult !== undefined) {
          throw Error(this.errorSecond);
        }
        this.classResult.push(`.${value1}`);
        return this;
      },

      attr(value1) {
        if (this.pseudoClassResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.pseudoElementResult !== undefined) {
          throw Error(this.errorSecond);
        }
        this.attrResult.push(`[${value1}]`);
        return this;
      },

      pseudoClass(value1) {
        if (this.pseudoElementResult !== undefined) {
          throw Error(this.errorSecond);
        }
        this.pseudoClassResult.push(`:${value1}`);
        return this;
      },

      pseudoElement(value1) {
        if (this.pseudoElementResult !== undefined) throw Error(this.errorFirst);
        this.pseudoElementResult = `::${value1}`;
        return this;
      },

      combine(selector1, combinator, selector2) {
        this.combineResult = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
        return this;
      },
      stringify() {
        let result = '';
        if (this.elementResult !== undefined) {
          result += this.elementResult;
          this.elementResult = undefined;
        }
        if (this.idResult !== undefined) {
          result += this.idResult;
          this.idResult = undefined;
        }
        if (this.classResult.length !== 0) {
          result += this.classResult.join('');
          this.classResult = [];
        }
        if (this.attrResult.length !== 0) {
          result += this.attrResult.join('');
          this.attrResult = [];
        }
        if (this.pseudoClassResult.length !== 0) {
          result += this.pseudoClassResult.join('');
          this.pseudoClassResult = [];
        }
        if (this.pseudoElementResult !== undefined) {
          result += this.pseudoElementResult;
          this.pseudoElementResult = undefined;
        }
        if (this.combineResult !== undefined) {
          result += this.combineResult;
          this.combineResult = undefined;
        }
        return result;
      },
    };
    obj.elementResult = value;
    return obj;
  },

  id(value) {
    const obj = {
      errorFirst: 'Element, id and pseudo-element should not occur more then one time inside the selector',
      errorSecond: 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      elementResult: undefined,
      idResult: undefined,
      classResult: [],
      attrResult: [],
      pseudoClassResult: [],
      pseudoElementResult: undefined,
      combineResult: undefined,
      element(value1) {
        if (this.elementResult !== undefined) throw Error(this.errorFirst);
        if (this.idResult !== undefined) {
          throw Error(this.errorSecond);
        } else if (this.classResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.attrResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.pseudoClassResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.pseudoElementResult !== undefined) {
          throw Error(this.errorSecond);
        }
        this.elementResult = value1;
        return this;
      },
      id(value1) {
        if (this.idResult !== undefined) throw Error(this.errorFirst);
        if (this.classResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.attrResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.pseudoClassResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.pseudoElementResult !== undefined) {
          throw Error(this.errorSecond);
        }
        this.idResult = `#${value1}`;
        return this;
      },

      class(value1) {
        if (this.attrResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.pseudoClassResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.pseudoElementResult !== undefined) {
          throw Error(this.errorSecond);
        }
        this.classResult.push(`.${value1}`);
        return this;
      },

      attr(value1) {
        if (this.pseudoClassResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.pseudoElementResult !== undefined) {
          throw Error(this.errorSecond);
        }
        this.attrResult.push(`[${value1}]`);
        return this;
      },

      pseudoClass(value1) {
        if (this.pseudoElementResult !== undefined) {
          throw Error(this.errorSecond);
        }
        this.pseudoClassResult.push(`:${value1}`);
        return this;
      },

      pseudoElement(value1) {
        if (this.pseudoElementResult !== undefined) throw Error(this.errorFirst);
        this.pseudoElementResult = `::${value1}`;
        return this;
      },

      combine(selector1, combinator, selector2) {
        this.combineResult = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
        return this;
      },
      stringify() {
        let result = '';
        if (this.elementResult !== undefined) {
          result += this.elementResult;
          this.elementResult = undefined;
        }
        if (this.idResult !== undefined) {
          result += this.idResult;
          this.idResult = undefined;
        }
        if (this.classResult.length !== 0) {
          result += this.classResult.join('');
          this.classResult = [];
        }
        if (this.attrResult.length !== 0) {
          result += this.attrResult.join('');
          this.attrResult = [];
        }
        if (this.pseudoClassResult.length !== 0) {
          result += this.pseudoClassResult.join('');
          this.pseudoClassResult = [];
        }
        if (this.pseudoElementResult !== undefined) {
          result += this.pseudoElementResult;
          this.pseudoElementResult = undefined;
        }
        if (this.combineResult !== undefined) {
          result += this.combineResult;
          this.combineResult = undefined;
        }
        return result;
      },
    };
    obj.idResult = `#${value}`;
    return obj;
  },

  class(value) {
    const obj = {
      errorFirst: 'Element, id and pseudo-element should not occur more then one time inside the selector',
      errorSecond: 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      elementResult: undefined,
      idResult: undefined,
      classResult: [],
      attrResult: [],
      pseudoClassResult: [],
      pseudoElementResult: undefined,
      combineResult: undefined,
      element(value1) {
        if (this.elementResult !== undefined) throw Error(this.errorFirst);
        if (this.idResult !== undefined) {
          throw Error(this.errorSecond);
        } else if (this.classResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.attrResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.pseudoClassResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.pseudoElementResult !== undefined) {
          throw Error(this.errorSecond);
        }
        this.elementResult = value1;
        return this;
      },
      id(value1) {
        if (this.idResult !== undefined) throw Error(this.errorFirst);
        if (this.classResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.attrResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.pseudoClassResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.pseudoElementResult !== undefined) {
          throw Error(this.errorSecond);
        }
        this.idResult = `#${value1}`;
        return this;
      },

      class(value1) {
        if (this.attrResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.pseudoClassResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.pseudoElementResult !== undefined) {
          throw Error(this.errorSecond);
        }
        this.classResult.push(`.${value1}`);
        return this;
      },

      attr(value1) {
        if (this.pseudoClassResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.pseudoElementResult !== undefined) {
          throw Error(this.errorSecond);
        }
        this.attrResult.push(`[${value1}]`);
        return this;
      },

      pseudoClass(value1) {
        if (this.pseudoElementResult !== undefined) {
          throw Error(this.errorSecond);
        }
        this.pseudoClassResult.push(`:${value1}`);
        return this;
      },

      pseudoElement(value1) {
        if (this.pseudoElementResult !== undefined) throw Error(this.errorFirst);
        this.pseudoElementResult = `::${value1}`;
        return this;
      },

      combine(selector1, combinator, selector2) {
        this.combineResult = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
        return this;
      },
      stringify() {
        let result = '';
        if (this.elementResult !== undefined) {
          result += this.elementResult;
          this.elementResult = undefined;
        }
        if (this.idResult !== undefined) {
          result += this.idResult;
          this.idResult = undefined;
        }
        if (this.classResult.length !== 0) {
          result += this.classResult.join('');
          this.classResult = [];
        }
        if (this.attrResult.length !== 0) {
          result += this.attrResult.join('');
          this.attrResult = [];
        }
        if (this.pseudoClassResult.length !== 0) {
          result += this.pseudoClassResult.join('');
          this.pseudoClassResult = [];
        }
        if (this.pseudoElementResult !== undefined) {
          result += this.pseudoElementResult;
          this.pseudoElementResult = undefined;
        }
        if (this.combineResult !== undefined) {
          result += this.combineResult;
          this.combineResult = undefined;
        }
        return result;
      },
    };
    obj.classResult.push(`.${value}`);
    return obj;
  },

  attr(value) {
    const obj = {
      errorFirst: 'Element, id and pseudo-element should not occur more then one time inside the selector',
      errorSecond: 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      elementResult: undefined,
      idResult: undefined,
      classResult: [],
      attrResult: [],
      pseudoClassResult: [],
      pseudoElementResult: undefined,
      combineResult: undefined,
      element(value1) {
        if (this.elementResult !== undefined) throw Error(this.errorFirst);
        if (this.idResult !== undefined) {
          throw Error(this.errorSecond);
        } else if (this.classResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.attrResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.pseudoClassResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.pseudoElementResult !== undefined) {
          throw Error(this.errorSecond);
        }
        this.elementResult = value1;
        return this;
      },
      id(value1) {
        if (this.idResult !== undefined) throw Error(this.errorFirst);
        if (this.classResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.attrResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.pseudoClassResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.pseudoElementResult !== undefined) {
          throw Error(this.errorSecond);
        }
        this.idResult = `#${value1}`;
        return this;
      },

      class(value1) {
        if (this.attrResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.pseudoClassResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.pseudoElementResult !== undefined) {
          throw Error(this.errorSecond);
        }
        this.classResult.push(`.${value1}`);
        return this;
      },

      attr(value1) {
        if (this.pseudoClassResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.pseudoElementResult !== undefined) {
          throw Error(this.errorSecond);
        }
        this.attrResult.push(`[${value1}]`);
        return this;
      },

      pseudoClass(value1) {
        if (this.pseudoElementResult !== undefined) {
          throw Error(this.errorSecond);
        }
        this.pseudoClassResult.push(`:${value1}`);
        return this;
      },

      pseudoElement(value1) {
        if (this.pseudoElementResult !== undefined) throw Error(this.errorFirst);
        this.pseudoElementResult = `::${value1}`;
        return this;
      },

      combine(selector1, combinator, selector2) {
        this.combineResult = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
        return this;
      },
      stringify() {
        let result = '';
        if (this.elementResult !== undefined) {
          result += this.elementResult;
          this.elementResult = undefined;
        }
        if (this.idResult !== undefined) {
          result += this.idResult;
          this.idResult = undefined;
        }
        if (this.classResult.length !== 0) {
          result += this.classResult.join('');
          this.classResult = [];
        }
        if (this.attrResult.length !== 0) {
          result += this.attrResult.join('');
          this.attrResult = [];
        }
        if (this.pseudoClassResult.length !== 0) {
          result += this.pseudoClassResult.join('');
          this.pseudoClassResult = [];
        }
        if (this.pseudoElementResult !== undefined) {
          result += this.pseudoElementResult;
          this.pseudoElementResult = undefined;
        }
        if (this.combineResult !== undefined) {
          result += this.combineResult;
          this.combineResult = undefined;
        }
        return result;
      },
    };
    obj.attrResult.push(`[${value}]`);
    return obj;
  },

  pseudoClass(value) {
    const obj = {
      errorFirst: 'Element, id and pseudo-element should not occur more then one time inside the selector',
      errorSecond: 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      elementResult: undefined,
      idResult: undefined,
      classResult: [],
      attrResult: [],
      pseudoClassResult: [],
      pseudoElementResult: undefined,
      combineResult: undefined,
      element(value1) {
        if (this.elementResult !== undefined) throw Error(this.errorFirst);
        if (this.idResult !== undefined) {
          throw Error(this.errorSecond);
        } else if (this.classResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.attrResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.pseudoClassResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.pseudoElementResult !== undefined) {
          throw Error(this.errorSecond);
        }
        this.elementResult = value1;
        return this;
      },
      id(value1) {
        if (this.idResult !== undefined) throw Error(this.errorFirst);
        if (this.classResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.attrResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.pseudoClassResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.pseudoElementResult !== undefined) {
          throw Error(this.errorSecond);
        }
        this.idResult = `#${value1}`;
        return this;
      },

      class(value1) {
        if (this.attrResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.pseudoClassResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.pseudoElementResult !== undefined) {
          throw Error(this.errorSecond);
        }
        this.classResult.push(`.${value1}`);
        return this;
      },

      attr(value1) {
        if (this.pseudoClassResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.pseudoElementResult !== undefined) {
          throw Error(this.errorSecond);
        }
        this.attrResult.push(`[${value1}]`);
        return this;
      },

      pseudoClass(value1) {
        if (this.pseudoElementResult !== undefined) {
          throw Error(this.errorSecond);
        }
        this.pseudoClassResult.push(`:${value1}`);
        return this;
      },

      pseudoElement(value1) {
        if (this.pseudoElementResult !== undefined) throw Error(this.errorFirst);
        this.pseudoElementResult = `::${value1}`;
        return this;
      },

      combine(selector1, combinator, selector2) {
        this.combineResult = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
        return this;
      },
      stringify() {
        let result = '';
        if (this.elementResult !== undefined) {
          result += this.elementResult;
          this.elementResult = undefined;
        }
        if (this.idResult !== undefined) {
          result += this.idResult;
          this.idResult = undefined;
        }
        if (this.classResult.length !== 0) {
          result += this.classResult.join('');
          this.classResult = [];
        }
        if (this.attrResult.length !== 0) {
          result += this.attrResult.join('');
          this.attrResult = [];
        }
        if (this.pseudoClassResult.length !== 0) {
          result += this.pseudoClassResult.join('');
          this.pseudoClassResult = [];
        }
        if (this.pseudoElementResult !== undefined) {
          result += this.pseudoElementResult;
          this.pseudoElementResult = undefined;
        }
        if (this.combineResult !== undefined) {
          result += this.combineResult;
          this.combineResult = undefined;
        }
        return result;
      },
    };
    obj.pseudoClassResult.push(`:${value}`);
    return obj;
  },

  pseudoElement(value) {
    const obj = {
      errorFirst: 'Element, id and pseudo-element should not occur more then one time inside the selector',
      errorSecond: 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      elementResult: undefined,
      idResult: undefined,
      classResult: [],
      attrResult: [],
      pseudoClassResult: [],
      pseudoElementResult: undefined,
      combineResult: undefined,
      element(value1) {
        if (this.elementResult !== undefined) throw Error(this.errorFirst);
        if (this.idResult !== undefined) {
          throw Error(this.errorSecond);
        } else if (this.classResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.attrResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.pseudoClassResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.pseudoElementResult !== undefined) {
          throw Error(this.errorSecond);
        }
        this.elementResult = value1;
        return this;
      },
      id(value1) {
        if (this.idResult !== undefined) throw Error(this.errorFirst);
        if (this.classResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.attrResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.pseudoClassResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.pseudoElementResult !== undefined) {
          throw Error(this.errorSecond);
        }
        this.idResult = `#${value1}`;
        return this;
      },

      class(value1) {
        if (this.attrResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.pseudoClassResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.pseudoElementResult !== undefined) {
          throw Error(this.errorSecond);
        }
        this.classResult.push(`.${value1}`);
        return this;
      },

      attr(value1) {
        if (this.pseudoClassResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.pseudoElementResult !== undefined) {
          throw Error(this.errorSecond);
        }
        this.attrResult.push(`[${value1}]`);
        return this;
      },

      pseudoClass(value1) {
        if (this.pseudoElementResult !== undefined) {
          throw Error(this.errorSecond);
        }
        this.pseudoClassResult.push(`:${value1}`);
        return this;
      },

      pseudoElement(value1) {
        if (this.pseudoElementResult !== undefined) throw Error(this.errorFirst);
        this.pseudoElementResult = `::${value1}`;
        return this;
      },

      combine(selector1, combinator, selector2) {
        this.combineResult = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
        return this;
      },
      stringify() {
        let result = '';
        if (this.elementResult !== undefined) {
          result += this.elementResult;
          this.elementResult = undefined;
        }
        if (this.idResult !== undefined) {
          result += this.idResult;
          this.idResult = undefined;
        }
        if (this.classResult.length !== 0) {
          result += this.classResult.join('');
          this.classResult = [];
        }
        if (this.attrResult.length !== 0) {
          result += this.attrResult.join('');
          this.attrResult = [];
        }
        if (this.pseudoClassResult.length !== 0) {
          result += this.pseudoClassResult.join('');
          this.pseudoClassResult = [];
        }
        if (this.pseudoElementResult !== undefined) {
          result += this.pseudoElementResult;
          this.pseudoElementResult = undefined;
        }
        if (this.combineResult !== undefined) {
          result += this.combineResult;
          this.combineResult = undefined;
        }
        return result;
      },
    };
    obj.pseudoElementResult = `::${value}`;
    return obj;
  },

  combine(selector1, combinator, selector2) {
    const obj = {
      errorFirst: 'Element, id and pseudo-element should not occur more then one time inside the selector',
      errorSecond: 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      elementResult: undefined,
      idResult: undefined,
      classResult: [],
      attrResult: [],
      pseudoClassResult: [],
      pseudoElementResult: undefined,
      combineResult: undefined,
      element(value1) {
        if (this.elementResult !== undefined) throw Error(this.errorFirst);
        if (this.idResult !== undefined) {
          throw Error(this.errorSecond);
        } else if (this.classResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.attrResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.pseudoClassResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.pseudoElementResult !== undefined) {
          throw Error(this.errorSecond);
        }
        this.elementResult = value1;
        return this;
      },
      id(value1) {
        if (this.idResult !== undefined) throw Error(this.errorFirst);
        if (this.classResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.attrResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.pseudoClassResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.pseudoElementResult !== undefined) {
          throw Error(this.errorSecond);
        }
        this.idResult = `#${value1}`;
        return this;
      },

      class(value1) {
        if (this.attrResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.pseudoClassResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.pseudoElementResult !== undefined) {
          throw Error(this.errorSecond);
        }
        this.classResult.push(`.${value1}`);
        return this;
      },

      attr(value1) {
        if (this.pseudoClassResult.length !== 0) {
          throw Error(this.errorSecond);
        } else if (this.pseudoElementResult !== undefined) {
          throw Error(this.errorSecond);
        }
        this.attrResult.push(`[${value1}]`);
        return this;
      },

      pseudoClass(value1) {
        if (this.pseudoElementResult !== undefined) {
          throw Error(this.errorSecond);
        }
        this.pseudoClassResult.push(`:${value1}`);
        return this;
      },

      pseudoElement(value1) {
        if (this.pseudoElementResult !== undefined) throw Error(this.errorFirst);
        this.pseudoElementResult = `::${value1}`;
        return this;
      },

      combine(selector11, combinator1, selector21) {
        this.combineResult = `${selector11.stringify()} ${combinator1} ${selector21.stringify()}`;
        return this;
      },
      stringify() {
        let result = '';
        if (this.elementResult !== undefined) {
          result += this.elementResult;
          this.elementResult = undefined;
        }
        if (this.idResult !== undefined) {
          result += this.idResult;
          this.idResult = undefined;
        }
        if (this.classResult.length !== 0) {
          result += this.classResult.join('');
          this.classResult = [];
        }
        if (this.attrResult.length !== 0) {
          result += this.attrResult.join();
          this.attrResult = [];
        }
        if (this.pseudoClassResult.length !== 0) {
          result += this.pseudoClassResult.join();
          this.pseudoClassResult = [];
        }
        if (this.pseudoElementResult !== undefined) {
          result += this.pseudoElementResult;
          this.pseudoElementResult = undefined;
        }
        if (this.combineResult !== undefined) {
          result += this.combineResult;
          this.combineResult = undefined;
        }
        return result;
      },
    };
    obj.combineResult = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
    return obj;
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
