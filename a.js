Monad = function(val, func, lifted){
	let ret = function(f){
		return f==undefined?val:Monad(func.apply(val,[].slice.call(arguments)),func,lifted);
	}
	ret.lift=function(fun){
		return Monad(val,func,(lifted?lifted.slice(0):[]).concat(fun))
	}
	ret.drop=function(fun){
		return Monad(val,func,(lifted.filter(f=>f.name!=fun.name)))
	}
	ret.repeat=function(num, fun){
		let newVal = val;
		for (let i = 0; i < num; i++) {
			newVal = fun.call(newVal);
		}
		return Monad(newVal,func,lifted);
	}
	if (lifted){
		Object.keys(lifted).forEach(
			f=>ret[f]=function(){
				return Monad(lifted[f].apply(val,[].slice.call(arguments)),func,lifted);
			}
		)
	}
	ret.valueOf = function(){return [].__proto__.isPrototypeOf(val)?"["+val.toString()+"]":JSON.stringify(val)	};
	return ret;
}

NULL={};
vbind = function(){
	let nulc = 0;
	let ret = this.bind(arguments[0]);
	let args = arguments;
	let fun = this;
	return function(){
		let c = 0;
		let newArgs = [].map.call(args,a=>a==NULL?arguments[c++]:a);
		return fun.apply(newArgs[0],newArgs.slice(1));
	}
}

Function.prototype.vbind=vbind;

Strmo = function(str){
	return Monad(str.split(""),[].map);
}

//makes new function that uses "this" as first argument
//converts (a,b)=>a+b to function(b){return this+b}
tis=function(f){
	return (function(a,b){
		a.name = b
		return a
	})(function(){
		return f.apply(0,[this].concat([].slice.call(arguments)))
	}, f.name)
}



parse=parseInt.bind(0);
parse10=parseInt.vbind(0,NULL,10)
parse16=parseInt.vbind(0,NULL,16)

sum=function(a,b){
	return a+b;
}

chr=function(n){
	return String.fromCharCode(n);
}
ord=function(c){
	return c.charCodeAt(0);
}
chrs=function(a){
	return a.map(chr).join("");
}
ords=function(s){
	return s.split("").map(ord);
}

range = function(a,b,c) {
	if (b == undefined)
		return Array(a).fill().map((x,y)=>y)
	if (c == undefined)
		return Array(b-a).fill().map((x,y)=>y+a)
	var r = []
	for (;a < b; a+=c)
		r.push(a)
	return r
}

log=console.log.bind(console);

"".__proto__.__defineGetter__("hex",function(){
	return ords(this).map(hex).join("")
})
"".__proto__.__defineGetter__("unhex",function(){
	var h = this
	return range(h.length / 2).map(a=>h.substring(2*a,2*a+2)).map(parse16).map(chr).join("");
})

hex = function(i) {
	if (typeof i === "number")
		return i.toString(16)
	if (typeof i === "string")
		return ords(i).map(hex).join("")
}

unhex = function(h) {
	return range(h.length / 2).map(a=>h.substring(2*a,2*a+2)).map(parse16).map(chr).join("")
}

Array.prototype.splitEvery = function(n){
	return range(this.length/n).map(x=>this.slice(x,x+n))
}

String.prototype.splitEvery = function(n){
	return this.split("").splitEvery(n).map(a=>a.join(""))
}

makeElement=function(e,w,h,c,i){
	let r = document.createElement(e);
	r.style.width=w;
	r.style.height=h;
	r.style.backgroundColor=c;
	if(i!=undefined)
		r.innerHTML=i;
	return r;
}
bodyAppend=function(e){
	document.body.appendChild(e);
}
headAppend=function(e){
	document.head.appendChild(e);
}

help = function(){
	[
		"chr(n)\t\t\t\t\t- char code to character",
		"ord(c)\t\t\t\t\t- character to char code",
		"chrs(a)\t\t\t\t\t- char codes to string",
		"ords(s)\t\t\t\t\t- string to char codes",
		"log\t\t\t\t\t\t- console.log",
		"Monad\t\t\t\t\t- does monad stuff",
		"Strmo\t\t\t\t\t- string monad",
		"vbind\t\t\t\t\t- bind with NULL for not first argument, useful for parseInt",
		"tis\t\t\t\t\t\t- converts function to use this as first arg",
		"makeElement(e,w,h,c,i)\t- creates element, e=tag, w=width, h=height, c=background color, i=innerHTML",
		"bodyAppend(e)\t\t\t- appends e to document.body",
		"headAppend(e)\t\t\t- appends e to document.head",
		"help()\t\t\t\t\t- lists help"
	].forEach(function(a){console.log(a)});
}
