document.body.style="margin:0px";
const w=10;
const h=10;
const c1="black";
const c2="white";
const spacerColor="skyblue"

function draw(){
    const cont =  makeElement("div",w,h,"red");
    document.body.appendChild(cont);
    return (function(cont,e,i,ar) {
        cont.style.width=ar.length*w;
        let ret = cell(e);
        cont.appendChild(ret);
        return e;
    }).bind(0,cont)
}

const numCells = Math.floor(window.innerWidth/w);

function rand() {
    return Array(numCells).fill().map(a=>~~(Math.random()*2))
}

function cell(v,c){
    let ret = makeElement("div",w,h,c?c:v?c1:c2);
    ret.style.float="left";
    return ret;
}

m = Monad(rand(),[].map)

const rule = Array(8).fill().map(a=>~~(Math.random()*2));//[1,1,1,0,1,0,0,0]
console.log("Rule: " + rule)

function showRule(){
    let d=makeElement("div",window.innerWidth,h*4,"white");
    let dw = document.createElement("div");
    dw.style.position="absolute";
    dw.style.left="50%";
    let d1=makeElement("div",33*w,h,"white");
    let d2=makeElement("div",33*w,h,"white");
    [cell(0,spacerColor)].concat(Array(8).fill().map((a,b)=>[(~~(b/4))%2,(~~(b/2))%2,b%2]).map(function(a){
        let a0 = cell(a[0]);
        let a1 = cell(a[1]);
        let a2 = cell(a[2]);
        let spacer = cell(0,spacerColor);
        return [a0,a1,a2,spacer]
    }).reduce((a,b)=>a.concat(b))).forEach(d1.appendChild.bind(d1));
    [cell(0,spacerColor)].concat(Array(8).fill().map((a,b)=>b).map(function(a){
        let a0 = cell(0,spacerColor);
        let a1 = cell(rule[a]);
        let a2 = cell(0,spacerColor);
        let spacer = cell(0,spacerColor);
        return [a0,a1,a2,spacer]
    }).reduce((a,b)=>a.concat(b))).forEach(d2.appendChild.bind(d2));
    dw.appendChild(d1);
    dw.appendChild(d2);
    d1.style.position="relative"
    d2.style.position="relative"
    d1.style.left="-50%"
    d2.style.left="-50%"
    d.appendChild(dw);
    document.body.appendChild(d)
}

showRule();
//"10010100".split("").map(parse)
/*=
[
    1,//000
    0,//001
    0,//010
    1,//011
    0,//100
    1,//101
    1,//110
    0//111
]
*/
function grow(a,b,c){
    const len = c.length;
    return rule[
        c[(b-1+len)%len]*4
        +a*2
        +c[(b+1)%len]];
}

function makeStuff(n){
    [m].concat(Array(n*2).fill().map((a,b)=>b%2?grow:draw())).reduce((a,b)=>a(b))
}

makeStuff(200)
