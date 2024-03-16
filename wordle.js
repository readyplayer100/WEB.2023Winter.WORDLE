/**
 * 本文件是在构建 Wordle 程序过程中需要使用的脚本
 * ! 在编写代码之前请您务必仔细阅读每一行注释
 * 其中部分函数已经给出，需要您根据实际需求进行补全
 * 函数的具体作用请参考注释
 * 请确保所有的 TODO 都被补全
 * 若无特殊需要请尽量不要定义新的函数
 */

/**
 * Global Variables
 * 
 * 您的所有全局变量需要在此处定义
 * 我们已经预先为您定义了一部分全局变量
 * 
 * 请思考：
 * 
 * 1. 为什么使用 let/const 来定义变量而不是 var 关键字
 * 2. let 和 const 关键字定义的变量有什么区别
 * 3. 已经被预定义的全局变量分别有怎样的作用
 */

// 固定的答案长度
const answerLength = 5;
// 最多尝试次数
const maxGuessTime = 6;

// Wordle 中出现的三种颜色，更推荐使用枚举
// 此处 green 用字母 b 表示，具体原因请参见代码任务
const grey = "#9f9fa5";
const yellow = "#b59f3b";
const green = "#538d4e";
const white = "#ffffff";
const mildgrey = "#EFEFEF";

// 颜色序列，类型为 string[]
let colorSequence = [];
// 单词序列，类型为 string[]
let wordSequence = [];


// 本次 Wordle 的答案
let answer = "";
let chinese = "";
let japanese = "";
// 当前猜测的答案
let guess = "";
// 当前已经使用的猜测次数
let currentGuessTime = 0;
// 当前输入的字母数，即第几个字母
let currentInputNo = 0;
/**
 * 程序当前的状态，更推荐使用枚举
 * 
 * 预计会使用到的状态：
 * 1. "UNFINISHED": 表示 Wordle 未被解决即仍有剩余猜测次数
 * 2. "SOLVED": 表示当前 Wordle 已被解决
 * 3. "FAILED": 表示当前 Wordle 解决失败
 * 可以根据需要设计新的状态
 */
let state = "UNFINISHED";

/**
 * 预定义的 JavaScript 程序的入口
 * 请不要额外定义其他的程序入口
 */
start();

/**
 * start()
 * 
 * 整个程序的入口函数，这里为了简化程序的运行逻辑违背了单一指责原则和最小权限原则，在实际开发时不推荐这样处理
 * 
 * 您需要完成的任务：
 * 1. 初始化程序的运行状态
 * 2. 接收交互信息后改变内部状态并作出反馈
 * 
 * 请思考：
 * 1. 在怎样的时刻需要调用 initialize 函数
 * 2. 程序的交互信息是什么（猜测的单词？）
 * 3. 内部状态会如何根据交互信息而改变（state 变量的作用？）
 * 4. 程序内部状态变化之后会作出怎样的反馈（页面重新渲染？）
 * 5. 如何读取交互信息
 * 6. 程序在什么时候会终止
 */
function start() {
    initialize();
    // TODO
    'click keyup'.split(' ').forEach((eventName) => {
        window.addEventListener(eventName, (e) => {
            let elementValue = '';
            let anstable = document.getElementById("tbl");
            if (e.type === 'click') {
                elementValue = e.target.getAttribute('value');
                e.target.blur();
            }
            else {
                elementValue = e.key;
                if (elementValue >= 'a' && elementValue <= 'z') {
                    elementValue = elementValue.toUpperCase();
                }
                if (elementValue === 'Enter') {
                    elementValue = 'ENTER';
                }
            }
            if (elementValue === 'Backspace') {

                if (parseInt(currentInputNo) > eval(0)) {

                    guess = guess.substring(0, currentInputNo - 1);
                    //console.log("guess1:" + guess);
                    currentInputNo--;
                    anstable.rows[currentGuessTime].cells[currentInputNo].innerHTML = '&nbsp';
                }
                else if (currentInputNo === 0) {
                    guess = "";
                }

            } else if (elementValue === 'ENTER') {
                // if(isValidWord() === false)
                // alert("Invalid word");
                let msg = '------------------------<br>';
                msg += 'English : ' + answer + '<br>';
                msg += 'Chinese : ' + chinese + '<br>';
                msg += 'Japanese : ' + japanese;
                let dialog;
                let popup;
                let button;
                calculateColorSequence(guess, answer);
                handleAnswer(guess);
                switch (state) {
                    case 'Solved':
                        render();
                        dialog = document.querySelector('dialog');
                        popup = document.getElementById("popmsg");
                        popup.innerHTML = 'Bingo!  <br>' + msg;
                        button = document.getElementById("idButton");
                        button.defaultValue = 'Play again';
                        dialog.showModal();
                        break;
                    case 'Failed':
                        render();
                        dialog = document.querySelector('dialog');
                        popup = document.getElementById("popmsg");
                        popup.innerHTML = "Sorry, You Failed. Better luck next time! <br>" + msg;
                        button = document.getElementById("idButton");
                        button.defaultValue = 'Play again';
                        dialog.showModal();
                        break;
                    case 'Unfinished':
                        render();
                        currentGuessTime++;
                        currentInputNo = 0;
                        guess = "";
                        break;
                    case 'Invalid':
                        dialog = document.querySelector('dialog');
                        popup = document.getElementById("popmsg");
                        popup.innerHTML = 'Not in word list';
                        button = document.getElementById("idButton");
                        //button.innerHTML = 'Correct your answer';
                        button.defaultValue = 'ReInput';
                        dialog.showModal();
                        break;
                    case 'NotEnough':
                        dialog = document.querySelector('dialog');
                        popup = document.getElementById("popmsg");
                        popup.innerHTML = 'Please enter five alphabets';
                        button = document.getElementById("idButton");
                        button.defaultValue = 'Correct your answer';
                        dialog.showModal();

                }

            }

            else if (elementValue !== null && parseInt(currentInputNo) < eval(5)
                && elementValue.length === eval(1) && elementValue >= 'A' && elementValue <= 'Z') {
                anstable.rows[currentGuessTime].cells[currentInputNo].innerHTML = elementValue;
                guess += elementValue;
                //console.log("guess2:" + guess);
                currentInputNo++;

            }

            else if (elementValue === 'ReInput') {
                let dialog = document.querySelector('dialog');
                dialog.close();
            }
            else if (elementValue === 'Play again') {
                let dialog = document.querySelector('dialog');
                dialog.close();
                initialize();
            }
            else if (elementValue === 'Correct your answer') {
                let dialog = document.querySelector('dialog');
                dialog.close();
            }
        })
    })
}

/**
 * render()
 * 
 * 根据程序当前的状态渲染对应的用户页面
 * 
 * 您需要完成的任务：
 * 1. 基于 DOM 实现程序状态和 HTML 组件的绑定
 * 2. 当程序内部状态发生改变时需要重新渲染页面
 * 
 * 请思考：
 * 1. 什么是 DOM，这项技术有怎样的作用
 * 2. 如何实现程序内部状态和 HTML 组建的绑定，为什么要这么设计
 * 3. 应该在怎样的时刻调用 render 函数
 */
function render() {
    // TODO
    console.log("answer=" + answer);
    console.log("guess=" + guess);
    let anstable = document.getElementById("tbl");

    let colorSequenceStr = '';
    colorSequenceStr = calculateColorSequence(guess, answer)
    let colorSequenceArray = colorSequenceStr.split("");
    let guessArray = guess.split("");

    for (let i = 0; i < 5; i++) {
        if (colorSequenceArray[i] === 'b') {
            anstable.rows[currentGuessTime].cells[i].bgColor = green;
            let key = document.getElementById(guessArray[i].toLowerCase());
            key.style.backgroundColor = green;
        }
        if (colorSequenceArray[i] === 'g') {
            anstable.rows[currentGuessTime].cells[i].bgColor = grey;
            let key = document.getElementById(guessArray[i].toLowerCase());
            key.style.backgroundColor = grey;
        }
        if (colorSequenceArray[i] === 'y') {
            anstable.rows[currentGuessTime].cells[i].bgColor = yellow;
            let key = document.getElementById(guessArray[i].toLowerCase());
            key.style.backgroundColor = yellow;
        }
    }

}

/**
 * initialize()
 * 
 * 初始化程序的状态
 * 
 * 请思考：
 * 1. 有哪些状态或变量需要被初始化
 * 2. 初始化时 state 变量处于怎样的状态
 */

function initialize() {
    // TODO
    if (answer !== "") {
        let anstable = document.getElementById("tbl");
        // table要素取得
        //alert(elementValue);
        //console.log(anstable);
        //console.log(currentGuessTime);
        const alphalists = "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z";
        const alphalist = alphalists.split(",");

        setTimeout(() => {
            for (let i = 0; i < 6; i++) {
                for (let j = 0; j < 5; j++) {
                    anstable.rows[i].cells[j].innerHTML = "";
                    anstable.rows[i].cells[j].bgColor = white;
                }
            }
            for (let i = 0; i < 26; i++) {
                let key = document.getElementById(alphalist[i]);
                //console.log(key.style.backgroundColor);
                key.style.backgroundColor = mildgrey;
            }

            // for (let i = "a".charCodeAt(0); i <= "z".charCodeAt(0); i++) {
            //     let key = document.getElementById(i);
            //     key.style.backgroundColor = mildgrey;
            // }
        }, 100);
    }
    currentGuessTime = 0;
    currentInputNo = 0;
    guess = "";

    answer = generateRandomAnswer();
    answer = answer.toUpperCase();
    let result = answer.toLowerCase();

    // 同文件夹下的json文件路径
    let url = "./static/dictionary.json"
    // 申明一个XMLHttpRequest
    let request = new XMLHttpRequest();
    // 设置请求方法与路径
    request.open("get", url, false); // 同步请求
    // 不发送数据到服务器
    request.send(null);

    if (request.status === 200) {
        const data = JSON.parse(request.responseText);
        //console.log(data.Dictionary);
        const translation = data.Dictionary.find(dic => dic.English === result);
        chinese = translation.Chinese;
        japanese = translation.Japanese;
        // console.log(chinese);
        // console.log(japanese);

    } else {
        console.error('Failed to load data');
    }
    //alert(answer);

}

/**
 * generateRandomAnswer()
 * 
 * 从题库中随机选取一个单词作为答案
 * 
 * 单词文件位于 /static/words.json 中
 * 
 * 请思考：
 * 1. 如何读取 json 文件
 * 2. 如何随机抽取一个单词
 * 
 * @return {string} answer
 */
function generateRandomAnswer() {
    // TODO

    // 同文件夹下的json文件路径
    let url = "./static/words.json"
    // 申明一个XMLHttpRequest
    let request = new XMLHttpRequest();
    // 设置请求方法与路径
    request.open("get", url, false); // 同步请求
    // 不发送数据到服务器
    request.send(null);

    if (request.status === 200) {
        wordSequence = JSON.parse(request.responseText).words;
        return wordSequence[Math.floor(Math.random() * wordSequence.length)];
    } else {
        console.error('Failed to load data');
    }
}

/**
 * isValidWord()
 * 
 * 判断一个单词是否合法
 * 
 * 请思考：
 * 1. 判断一个单词是否合法的规则有哪些
 * 2. 是否存在多条判断规则
 * 3. 如果上条成立，那么这些规则执行的先后顺序是怎样的，不同的执行顺序是否会对单词的合法性判断造成影响
 * 4. 如果单词不合法，那么程序的状态会如何变化，程序应当作出怎样的反馈
 * 
 * @param {string} word 
 * @return {boolean} isValid
 */
function isValidWord(word) {
    // TODO

    let isValidWd = wordSequence.find(wd => wd === word.toLowerCase());
    console.log(word);
    //console.log(wordSequence);
    if (isValidWd === undefined) {
        //alert("un");
        return false;
    }
    else return true;
}

/**
 * handleAnswer()
 * 
 * 处理一次对单词的猜测，并根据其猜测结果更新程序内部状态
 * 
 * 请思考：
 * 1. 是否需要对 guess 变量的字符串作某种预处理，为什么
 * 
 * @param {string} guess 
 */
function handleAnswer(guess) {
    // TODO
    // if (answer.localeCompare(guess) === 0)
    //     state = "Solved";
    // else if (currentGuessTime === 6)
    //     state = "Failed";
    // else if (parseInt(currentInputNo) === eval(5) && currentGuessTime <= maxGuessTime
    //     && !(isValidWord(guess)))
    //     state = "Invalid";
    if (parseInt(currentInputNo) === eval(5) && currentGuessTime <= maxGuessTime && isValidWord(guess)) {
        if (answer.localeCompare(guess) === 0) {
            state = "Solved";
        }
        else {
            if (currentGuessTime === 5) {
                state = "Failed";
            }
            else state = "Unfinished";
        }
    }
    else if (parseInt(currentInputNo) === eval(5) && currentGuessTime <= maxGuessTime
        && !(isValidWord(guess))) {
        state = "Invalid";
    }
    else state = "NotEnough";
}

/**
 * calculateColorSequence()
 * 
 * 计算两个单词的颜色匹配序列
 * 
 * 例如：
 * 给定 answer = "apple", guess = "angel"
 * 
 * 那么返回结果为："bggyy"
 * 
 * 请思考：
 * 1. Wordle 的颜色匹配算法是如何实现的
 * 2. 有哪些特殊的匹配情况
 *
 * @param {string} guess
 * @param {string} answer
 * @return {string} colorSequence
 */
function calculateColorSequence(guess, answer) {
    // TODO

    let guessArray = guess.split("");
    let answerArray = answer.split("");
    for (let i = 0; i < 5; i++) {
        if (guessArray[i] === answerArray[i]) {
            colorSequence[i] = 'b';
            guessArray[i] = " ";
            answerArray[i] = " ";
        }
    }
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            if (guessArray[i] !== ' ') {
                if (guessArray[i] === answerArray[j]) {
                    colorSequence[i] = 'y';
                    answerArray[j] = ' ';
                    guessArray[i] = ' ';
                }
                else colorSequence[i] = 'g';
            }
        }
    }
    let colorSequenceStr = colorSequence.join("");
    return colorSequenceStr;
}
