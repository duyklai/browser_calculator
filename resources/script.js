//Script for browser_calculator

//Initial and set-up variables
const history = document.querySelector('#history_display');
const display = document.querySelector('#main_display');
const digitsButtons = document.querySelectorAll('.ButtonNum');
const opButtons = document.querySelectorAll('.ButtonOp');
const fncButtons = document.querySelectorAll('.ButtonFnc');
let operatorSelected = false;
let equalSelected = false;
let percentagePressed = false;
let firstOperand, secondOperand, operatorEval;

//--Function block of "helper functions" for calculating the results
const add = function(x, y)
{
    return (x + y);
}

const subtract = function (x, y)
{
    return (x - y);
}

const multiply = function (x, y)
{
    return (x * y);
}

const divide = function (x, y)
{
    return (x / y);
}

const operate = function(operator, x, y)
{
    switch(operator)
    {
        case "add":
            return add(x, y);
        case "subtract":
            return subtract(x, y);
        case "multiply":
            return multiply(x, y);
        case "divide":
            return divide(x, y);
        default:
            break;
    }
}
//--End of function block for operators calculation

//Function to separate the first operand and second operand
const operatorPressed = function(e)
{
    firstOperand = display.innerHTML;
    operatorEval = e.target.id;
    //Change secondOperand away from undefined to prep for user input of secondOperand
    equalSelected = false;
    secondOperand = "ready";
    history.innerHTML = display.innerHTML + ' ' + e.target.innerHTML;
}

//Function responsible for changing the display
const concatDisplay = function(num)
{
    if(!operatorSelected)   //Initial case where user is inputting firstOperand
    {
        if(display.innerHTML == "0")  //Checking initial case where calculator is 0
        {
            if(num == 0)    //Prevents user from inputting uncessary zeroes
                return;
            else
                display.innerHTML = num;
        }
        else if(equalSelected)
        {
            display.innerHTML = num;
            equalSelected = false;
        }
        else    //If not initial case, concat the digits
        {
            display.innerHTML = display.innerHTML + '' + num;
        }
    }
    else    //If operator has been selected, start the display with fresh new secondOperand
    {
        display.innerHTML = num;
        operatorSelected = false;
    }
}

//Function to take care of ALL other function buttons
const functionPressed = function(e)
{
    //If "equal" button was pressed
    if(e.target.id == "equal")
    {
        if(typeof(secondOperand) == "undefined" || secondOperand == "undefined")
            return;
        else
            evalEQ(e);
    }
    else if(e.target.id == "clear") //If "AC" or "clear" button was pressed
    {
        history.innerHTML = '';
        display.innerHTML = 0;
        firstOperand = 0;
        secondOperand = 0;
        operatorSelected = false;
        equalSelected = false;
        percentagePressed = false;
    }
    else if(e.target.id == "del" && !equalSelected)   //If "DEL" button was pressed
    {
        if(display.innerHTML.length > 1)
            display.innerHTML = display.innerHTML.substr(0, display.innerHTML.length-1);
        else
            display.innerHTML = 0;
    }
    else if(e.target.id == "pm")    //If "plus/minus" button was pressed
    {
        display.innerHTML *= -1;
    }
    else if(e.target.id == "dot")   //If "decimal" button was pressed
    {
        if(display.innerHTML.includes('.')) //Prevents uncessary/repeated decimals
            return;
        else
            display.innerHTML += '.';
    }
    else if(e.target.id == "percent")   //If "percent" button was pressed
    {
        percentagePressed = true;
        if(display.innerHTML.includes('%') )  //Prevents uncessary/repeated percent signs
            return;//|| history.innerHTML.includes('%')
        else
            display.innerHTML += '%';
    }
    else
        return;
}

const evalEQ = function(e)
{
    secondOperand = display.innerHTML;
    if(!equalSelected)
    {
        equalSelected = true;
        if(!percentagePressed)  //If no percent sign was present:
        {
            //Changing both variables to integer for calculation
            firstOperand = +(firstOperand);
            secondOperand = +(display.innerHTML);
            //Update display
            history.innerHTML += ' ' + secondOperand;
            display.innerHTML = operate(operatorEval, firstOperand, secondOperand);
        }
        else
        {
            if(firstOperand.includes('%'))  //Case of percent sign being in the firstOperand
            {
                if(secondOperand.includes('%')) //Case of percent sign being in both operand
                {
                    //Need to update display first to include percent sign for secondOperand
                    history.innerHTML += ' ' + secondOperand;
                    //Removing the percent sign and change into integer for calculation
                    firstOperand = +(firstOperand.substr(0, firstOperand.length - 1)) / 100;secondOperand = +(secondOperand.substr(0, secondOperand.length - 1)) / 100;
                    //Temp variable to hold new operation
                    let tempSecond = (operate(operatorEval, firstOperand, operate("multiply", firstOperand, secondOperand))).toFixed(4);
                    display.innerHTML = tempSecond;
                }
                else
                {
                    //Removing the percent sign and change into integer for calculation
                    firstOperand = +(firstOperand.substr(0, firstOperand.length - 1)) / 100;
                    secondOperand = +(display.innerHTML);
                    //Update display
                    history.innerHTML += ' ' + secondOperand;
                    display.innerHTML = operate(operatorEval, firstOperand, secondOperand);
                }
            }
            else if(secondOperand.includes('%'))    //Case of percent sign being only in the secondOperand
            {
                //Removing the percent sign and change into integer for calculation
                firstOperand = +(firstOperand);
                //In the case that the secondOperand has percent sign, need to update display first
                history.innerHTML += ' ' + secondOperand;
                secondOperand = +(secondOperand.substr(0, secondOperand.length - 1)) / 100;
                if(operatorEval == "multiply" || operatorEval == "divide")
                {
                    //Update display with result
                    display.innerHTML = operate(operatorEval, firstOperand, secondOperand);
                }
                else if(operatorEval == "add" || operatorEval == "subtract")
                {
                    let tempSecond = (operate(operatorEval, firstOperand, operate("multiply", firstOperand, secondOperand))).toFixed(2);
                    display.innerHTML = tempSecond;
                }
            }
        }
        secondOperand = "undefined";
        percentagePressed = false;
    }
}

//Adding listerners to numbered buttons
digitsButtons.forEach(e => {
    e.addEventListener('click', (e) => {
        concatDisplay(e.target.innerHTML);
    });
});

//Adding listerners to operator buttons
opButtons.forEach(e => {
    e.addEventListener('click', (e) => {
        operatorPressed(e);
        operatorSelected = true;
    });
});

//Adding listerners to functions buttons
fncButtons.forEach(e => {
    e.addEventListener('click', (e) => {
        functionPressed(e);
    });
});