//Global variables declaration
var display = $('.calculator__display');
var opertors, priority, result;


var calculator = {
  init: function() {
    mousePush.init();
    keyboardPush.init();
    displayBlock.init();
  }
};

var displayBlock = {
  init: function () {
    $('.calculator__display').keypress(function () {
	     return false;
    });
  }
};

var mousePush = {
  init: function () {
    this.key();
    this.button();
    this.clean();
    this.backspace();
    this.equal();
  },

  key: function () {
    $('.calculator__key').click(function () {
      mistake.coverUp();
    });
  },

  button: function() {
    $('.calculator__button').click(function () {
      spellingRuntime.char =  $(this).attr('value');
      console.log(spellingRuntime.char);
      spellingRuntime.init();
    });

  },

  clean: function () {
    $('.calculator__clean').click(function () {
      operations.clean();
    })
  },

  backspace: function () {
    $('.calculator__backspace').click(function () {
      operations.backspace();
    });
  },

  equal: function () {
    $('.calculator__equal').click(function () {
      operations.equal();
    });
  },
}

var keyboardPush = {
  init: function () {
    this.button();
    this.clean();
    this.backspace();
    this.equal();
  },

  button: function () {
    $('.calculator__display').keydown(function (e) {
      mistake.coverUp();
      spellingRuntime.char = e.key;
      console.log(e.key);
      spellingRuntime.init();

    });
  },

  clean: function () {
    $('.calculator__display').keydown(function (e) {
      if (e.key == 'c') {
        operations.clean();
      }
    });
  },

  backspace: function () {
    $('.calculator__display').keydown(function (e) {
      if (e.key == 'Backspace') {
        operations.keyboardBackspace();
      }
    });
  },

  equal: function () {
    $('.calculator__display').keydown(function (e) {
      if (e.key == 'Enter' || e.key == '=') {
        operations.equal();
      }
    });
  }
};

var spellingRuntime = {
  init: function () {
    this.numerals();
    this.operator();
    this.openingBracket();
    this.closingBracket();
    this.percent();
    this.dot();
  },

  char: '',

  numerals: function () {
    if (this.char.match(/\d/g)) {


      if (last.percent() == true) {
        mistake.made("You can't input numbers right after percent sign");
      }

      else if (last.closingBracket() == true) {
        mistake.made("You can't input numbers right after closing bracket");
      }

      else {
        display.val(display.val() + this.char);
      }
    }
  },

  operator: function () {
    var operators = /\+|\-|\*|\//g;
       if (this.char.match(operators)) {

           if (last.number() == true) {
             display.val(display.val() + this.char);
             this.dotLock = false;
           }

           else if (last.operator() == true) {
             display.val(display.val().slice(0,display.val().length-1) + this.char);
           }

           else if (last.closingBracket() == true) {
             display.val(display.val() + this.char);
             this.dotLock = false;
           }

           else if (last.percent() == true) {
             display.val(display.val() + this.char);
             this.dotLock = false;
           }

           else if (last.openingBracket() == true) {
             if (this.char == '-') {
                display.val(display.val() + this.char);
                this.dotLock = false;
             }

             else {
               mistake.made("You can't input operators right after opening bracket");
             }
           }

           else if (display.val() == '') {
             if (this.char == '-') {
                display.val(display.val() + this.char);
                this.dotLock = false;
             }

             else {
                mistake.made("You can't input operators when form is empty");
             }

           }
       }

  },

  openingBracket: function () {

       if (this.char == "(") {

           if (display.val() == '') {
             display.val(display.val() + this.char);
             brackets.countUp();
           }

           else if (last.operator() == true) {
             display.val(display.val() + this.char);
             brackets.countUp();
           }

           else if (last.openingBracket() == true) {
             display.val(display.val() + this.char);
             brackets.countUp();
           }

           else if (last.number() == true) {
             mistake.made("You can input opening bracket only after operator or another opening bracket");
           }

           else if (last.percent() == true) {
             mistake.made("You can't input opening bracket right after percent sign");
           }
       }

  },

  closingBracket: function () {
       if (this.char == ")" && brackets.counter != 0) {
         if (last.number() == true) {
           display.val(display.val() + this.char);
           brackets.countDown();
         }

         else if (last.percent() == true) {
           display.val(display.val() + this.char);
           brackets.countDown();
         }

         else if (last.closingBracket() == true) {
           display.val(display.val() + this.char);
           brackets.countDown();
         }

         else if (last.operator() == true) {
           mistake.made("You can't input closing bracket right after operator");
         }

         else if (last.openingBracket() == true) {
           mistake.made("You can't input closing bracket right after opening bracket");
         }
       }

       else if (this.char == ")" && display.val() == '') {
         mistake.made("You can't input closing bracket when form is empty");
       }

       else if (this.char == ")" && brackets.counter == 0) {
         mistake.made("You can't input closing bracket without fitting opening bracket before");
       }
  },

  percent: function () {

       if (this.char == "%") {

         if (last.number() == true) {
           display.val(display.val() + this.char);
         }

         else if (last.closingBracket() == true) {
           display.val(display.val() + this.char);
         }

         else if (last.operator() == true) {
           display.val(display.val().slice(0,display.val().length-1) + this.char);
         }

         else if (last.openingBracket() == true) {
           mistake.made("You can't input % right after opening bracket");
         }

         else if (display.val() == '') {
           mistake.made("You can't input % when form is empty");
         }
       }

  },

  dotLock: false,

  dot: function () {
    if (this.char == '.') {
      if (this.dotLock == false) {
        console.log(this.dotLock);
        display.val(display.val() + this.char);
        this.dotLock = true;
        console.log(this.dotLock);
      }

    }
  }
};


var spelling = {
  init: function () {
    var check = display.val();

    if (check == '') {
      mistake.made('Please type something');
    }

    else if (check.match(/\%+\d/g) != null) {
      mistake.made("You can't input nubmer right after percent operator");
    }

    else if (check.match(/\)+\d/g) != null) {
      mistake.made("You can't input nubmer right after closing bracket");
    }

    else if (check.match(/^\s*$|\.\d+|\d+(\.\d+)|\d+|\+|\-|\*|\/|\%|\(|\)/g) == null) {
      mistake.made('You provided unsupported character or operator');
    }

    else if (check.match(/^(\+|\*|\/|\%|\))/g) != null) {
      mistake.made("Equation can't start with this operators [+ * / % )]");
    }

    else if (check.match(/(\+|\-|\*|\/|\()+(\+|\-|\*|\/)/g) != null) {
      mistake.made("Operator can't stay right after operator or opening bracket");
    }

    else if (check.match(/\d+\(/g) != null) {
      mistake.made("opening bracket can't stay right after number");
    }

    else if (check.match(/\%+\(/g) != null) {
      mistake.made("You can't input opening bracket right after percent sign");
    }

    else if (check.match(/\(+\)/g) != null) {
      mistake.made("You can't input closing bracket right after opening bracket");
    }

    else if (check.match(/(\+|\-|\*|\/)+\)/g) != null) {
      mistake.made("You can't input closing bracket right after operator");
    }

    else if (check.match(/\(+\%/g) != null) {
      mistake.made("You can't input % right after opening bracket");
    }

    else {
      brackets.solve();
    }
  }
};

var brackets = {
    counter: 0,
    content: '',
    inner: '',

    countUp: function () {
      this.counter++;
    },

    countDown: function () {
      this.counter--;
    },

    reset: function () {
      this.counter = 0;
    },

    solve: function () {
      var bracketsQuantity = display.val().match(/\(/g);
      var length;
      this.content = display.val();


      if (bracketsQuantity == null) {
        this.inner = this.content;
        convert.init();
        operations.init();
        var result = convert.convertedInput[0]
        if (isNaN(parseFloat(result)) == false || result == Infinity) {
          display.val(result);
        }
        else {
          display.val('Error');
        }

      }

      else {
        length = bracketsQuantity.length;
        var openingBracket, closingBracket;
        for (var i = 0; i < length; i++) {
          console.log(this.content);
          openingBracket = this.content.lastIndexOf('(');
          this.inner = this.content.slice(openingBracket);
          closingBracket = this.inner.indexOf(')')+1;
          this.inner = this.inner.slice(0, closingBracket);
          convert.init();
          console.log(convert.convertedInput);
          operations.init();
          convert.convertedInput.shift();
          convert.convertedInput.pop();
          this.content = this.content.replace(this.inner, convert.convertedInput);
          console.log(this.content);
        }

        this.inner = this.content;
        convert.init();
        operations.init();
        display.val(convert.convertedInput);

        var result = convert.convertedInput[0]
        if (isNaN(parseFloat(result)) == false || result == Infinity) {
          display.val(result);
        }
        else {
          display.val('Error');
        }
      }
    }
};


var last = {
  char: function () {
    var displayContent, previousChar, length;
    displayContent = display.val();
    length = displayContent.length;
    previousChar = displayContent[length-1];
    return previousChar;
  },

  dot: function () {
    var previousChar = this.char();
    return previousChar == ".";
  },

  number: function () {
    var previousChar = this.char();
    var lastNumber = parseFloat(previousChar);
    var nan  = isNaN(lastNumber)
    return nan == false;
  },

  operator: function () {
    var previousChar = this.char();
    if (previousChar == undefined) {
      previousChar = "";
    }
    var result = previousChar.match(/\+|\-|\*|\//g);
    return result != null;

  },

  openingBracket: function () {
    var previousChar = this.char();
    return previousChar == "(";
  },

  closingBracket: function () {
    var previousChar = this.char();
    return previousChar == ")";
  },

  percent: function () {
    var previousChar = this.char();
    return previousChar == "%";
  }
};



var mistake = {
  container: $('.calculator__error'),
  message: $('.calculator__error span'),

  made: function (type) {
    this.message.text(type);
    this.container.show('fast');
    $('.calculator').animate({boxShadow: '0 0 15px #b70404'}, 'fast');
  },

  coverUp: function () {
    this.container.hide('fast');
    $('.calculator').animate({boxShadow: 'none'}, 'fast');
  }
}


var convert = {
  convertedInput: [],

  init: function () {
    var temporarStorage;
    var string = brackets.inner;
    this.convertedInput = string.match(/\.\d+|\d+(\.\d+)|\d+|\+|\-|\*|\/|\%|\(|\)/g);
    temporarStorage = string.match(/\d+(\.\d+)|\d+|\+|\-|\*|\/|\%|\(|\)/g);
    for (var i = 0; i < this.convertedInput.length; i++) {
      this.convertedInput[i] = parseFloat(this.convertedInput[i]);
      if (isNaN(this.convertedInput[i]) == true) {
        this.convertedInput[i] = temporarStorage[i];
      }
    }

  }
};


var operations = {
  init: function () {
    var operatorsQuantity = display.val().match(/\+|\-|\*|\/|\%/g);
    for (var i = 0; i <operatorsQuantity.length; i++) {
      var checker = convert.convertedInput;
      this.percent();
      if (checker.indexOf('%') == -1){
        this.multiplying_dividing();

        if (checker.indexOf('*') == -1 && checker.indexOf('/') == -1) {
          this.addition_subtraction();
        }
      }
    }
  },

  findOperatorIndex: function (input) {
    var operation = convert.convertedInput,
        input,
        index,
        operationType;
    for (var i = 0; i < operation.length; i++) {
      if (isNaN(operation[i]) == true) {
        if (operation[i].match(input) != null) {
          operationType = operation[i];
          index = i;
          break;
        }
      }
    }
    return [operationType, index];
  },

  addition_subtraction: function () {
    var operatorIndex = this.findOperatorIndex(/\+|\-/);

    if (operatorIndex[0] != undefined) {
      var numbers = convert.convertedInput;
      var operationType = operatorIndex[0];
      var index = operatorIndex[1];
      console.log('index ' + index);
      console.log('last ' + last);
      //Addition
      if (operationType == "+") {
        if (numbers[index+1] == '-') {
          result = numbers[index-1] + (-numbers[index+2]);
          numbers.splice(index-1, 4, result);
          convert.convertedInput = numbers;
        }

        else if (numbers[index+1] == undefined) {
          result = numbers[index-1] + numbers[index-1];
          numbers.splice(index-1, 2, result);
          convert.convertedInput = numbers;
        }

        else {
          result = numbers[index-1] + numbers[index+1];
          numbers.splice(index-1, 3, result);
          convert.convertedInput = numbers;
        }
      }
      //Subtraction
      else {
        if (index == 0 || numbers[index-1] == "(") {
          result = -numbers[index+1];
          numbers.splice(index, 2, result);
          convert.convertedInput = numbers;
        }

        else {

          if (numbers[index+1] == '-') {
            result = numbers[index-1] - (-numbers[index+2]);
            numbers.splice(index-1, 4, result);
            convert.convertedInput = numbers;
          }

          else if (numbers[index+1] == undefined) {
            result = numbers[index-1] - numbers[index-1];
            numbers.splice(index-1, 2, result);
            convert.convertedInput = numbers;
          }

          else {
            result = numbers[index-1] - numbers[index+1];
            numbers.splice(index-1, 3, result);
            convert.convertedInput = numbers;
          }
        }

      }

      console.log(convert.convertedInput);
    }
  },

  multiplying_dividing: function () {
    var operatorIndex = this.findOperatorIndex(/\*|\//);

    if (operatorIndex[0] != undefined) {
      var numbers = convert.convertedInput;
      var operationType = operatorIndex[0];
      var index = operatorIndex[1];
      var last = operatorIndex[2];

      //Multiplying
      if (operationType == "*") {
        if (numbers[index+1] == '-') {
          result = numbers[index-1] * (-numbers[index+2]);
          numbers.splice(index-1, 4, result);
          convert.convertedInput = numbers;
        }

        else if (numbers[index+1] == undefined) {
          result = numbers[index-1] * numbers[index-1];
          numbers.splice(index-1, 2, result);
          convert.convertedInput = numbers;
        }

        else {
          result = numbers[index-1] * numbers[index+1];
          numbers.splice(index-1, 3, result);
          convert.convertedInput = numbers;
        }
      }


      //Dividing
      else {
        if (numbers[index+1] == '-') {
          result = numbers[index-1] / (-numbers[index+2]);
          numbers.splice(index-1, 4, result);
          convert.convertedInput = numbers;
        }

        else if (numbers[index+1] == undefined) {
          result = numbers[index-1] / numbers[index-1];
          numbers.splice(index-1, 2, result);
          convert.convertedInput = numbers;
        }

        else {
          result = numbers[index-1] / numbers[index+1];
          numbers.splice(index-1, 3, result);
          convert.convertedInput = numbers;
        }

      }

      console.log(convert.convertedInput);
    }
  },

  percent: function () {
    var operatorIndex = this.findOperatorIndex(/%/);

    if (operatorIndex[0] != undefined) {
      var numbers = convert.convertedInput;
      var operationType = operatorIndex[0];
      var index = operatorIndex[1];
      if (numbers[index-2] == "*" || numbers[index-2] == "/") {
        result = numbers[index-1]/100;
      }
      else if (numbers[index-2] == "+" || numbers[index-2] == "-") {
        result = (numbers[index-3]/100)*numbers[index-1];
      }
      numbers.splice(index-1, 2, result);
      convert.convertedInput = numbers;
      console.log(convert.convertedInput);
    }
  },

  clean: function () {
      spellingRuntime.dotLock = false;
      brackets.reset();
      display.val('');
  },

  backspace: function () {
      if (last.closingBracket() == true) {
        brackets.countUp();
      }
      else if (last.openingBracket() == true) {
        brackets.countDown();
      }
      if (last.dot() == true) {
        spellingRuntime.dotLock = false;
      }
      display.val(display.val().substring(0, display.val().length-1) );
  },

  keyboardBackspace: function () {
      if (last.closingBracket() == true) {
        brackets.countUp();
      }
      else if (last.openingBracket() == true) {
        brackets.countDown();
      }
      if (last.dot() == true) {
        spellingRuntime.dotLock = false;
      }
  },

  equal: function () {
      if (brackets.counter == 0) {
        spellingRuntime.dotLock = false;
        spelling.init();
      }

      else {
        mistake.made('Please close brackets');
      }
  }


};

var result = {
  display: function () {

  }
};




$('documnet').ready(calculator.init());
