const fs      = require('fs')
const http    = require('http')
const path    = require('path')
const hash    = require('crypto').createHash
const sqlite  = require('sqlite')
const sqlite3 = require('sqlite3')
const dayjs   = require('dayjs')
const _       = init()
const PORT    = 8080

function btime(x){
	return dayjs(Math.trunc(x/1000+Date.UTC(1601,0,1))).format("dddd DD MMMM YYYY HH:mm:ss")
}

list_pathx = [
"C:\\Users\\Nemo\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\History",
]

async function search(x){

	let tableau = []

	let db = await sqlite.open({filename:x,
	driver: sqlite3.Database
	})

	let rows = await db.all("SELECT * FROM urls")

	let max = rows.length

	for ( [i,row] of rows.entries() ){

		tableau.push({
		"title" : row.title,
		"url":row.url,
		"time": row.last_visit_time,
		"position":i,
		"id": row.id,
		"hidden": row.hidden
		})

	}

	tableau.sort( (a,b) => b.time - a.time )

	return tableau

}

const convert = (from, to) => str => Buffer.from(str, from).toString(to)
const hexEncode = convert('utf8', 'hex')
const hexDecode = convert('hex', 'utf8')

;(async () => {

	if( !fs.readdirSync("C:\\test\\History").includes("History") ){

		fs.copyFileSync("C:\\Users\\Nemo\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\History",
		"C:\\test\\History")

	}

	let a = await search("C:\\test\\History")

	a = a.filter( x=> x.time != 0 && x.hidden != 1 )

	//

	b = fs.readFileSync("C:\\test\\test.txt","utf8").split("\n")

	//

	a = a.filter( x => x.time >= JSON.parse(b[0]).time )

	a = a.map( x => ({ title:hexEncode(x.title),url:x.url,time:x.time }) )

	a = strArr(a)

	aa = _.difference(a,b)

	for( x of aa.reverse() )
	fs.appendFileSync("C:\\test\\test.txt", x + "\n" ) // C7PdeluC15k

	setTimeout(function () {
	fs.unlinkSync("C:\\test\\History")
	}, 2000)

})()

function strArr(x){

	let arr = []
	for( y of x )
	arr.push(JSON.stringify(y))
	return arr
}

function init(){

	String.prototype.short = function(n){

		if( this.length > n )
		str = this.slice(0,n) + "..."
		else
		str = this
		return str
	
	}

	String.prototype.server = function(n) {

		let v = this.valueOf()

		const http = require("http")
		const PORT = 8080

		http.createServer(function (req, res) {
			
			res.writeHead(200,{"content-type":`text/${n};charset=utf8`})

			res.end(v)

		}).listen(PORT)

		console.log(`Running at port ${PORT}`)

	}

	Array.prototype.renderRange = function(n,m){

		let STYLE = "<style>table{font-family:arial,sans-serif;border-collapse:collapse;}td,th{border:1px solid #dddddd;text-align:left;padding:8px;}</style>"

		if( !Array.isArray(this) )
		  return "not an array"

		if( m == undefined ){

			if( n > 0 )
			{min=0;max=n}
			else
			{n=(-n);min=this.length-n;max=this.length}

		}else{

			min=n;max=m
		}

		let content   = "<table>"
		let grandient = "background:repeating-linear-gradient(45deg,#606dbc,#606dbc 10px,#465298 10px,#465298 20px);"
		
		for( let i=min;i<max+1;i++ ){
			try { 
				let style = this[i]?.hidden == 1 ? 0.5 : 1
				content += `<tr style="opacity:${style};"><td>${i}</td><td style="">${_.escape(this[i].title).short(67)}</td><td>${btime(this[i].time)}</td>`
			}catch(e){
				content += `<tr><td>${i}</td><td style="${grandient}">&#8203</td><td>&#8203</td>`
			}
		}
		content += "</table>"
		content += STYLE
		return content
	}

	Object.prototype.str = function(n){

		if( n == 1 )
		return "<pre>"+JSON.stringify(this,null,2)+"</pre>"
		else
		return JSON.stringify(this,null,2)
	}
	
	require('C:/Users/Nemo/AppData/Roaming/npm/node_modules/dayjs/locale/fr')
	
	dayjs.locale('fr')
	
	return require('C:/Users/Nemo/AppData/Roaming/npm/node_modules/lodash')
  
}

;(async () => {

	if( !fs.readdirSync(__dirname).includes("History") ){

		fs.copyFileSync("C:\\Users\\Nemo\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\History",
		"C:\\Users\\Miguel\\Desktop\\test_hs\\History")

	}

	let a = await search("History")

	a = a.filter( x=> x.time != 0 && x.hidden != 1 )

	for(i=12431;i>=0;i--){

		console.log(i)
		let str =  { title:hexEncode(a[i].title),url:a[i].url,time:a[i].time }
		fs.appendFileSync( "test.txt", JSON.stringify(str) + "\n" )
	}

	// setTimeout(function () {
	// console.log('boo')
	// fs.unlinkSync("History")
	// }, 2000)

})

;(async () => {
	
	let a = await search(1)

	a = a.filter( x=> x.time != 0 && x.hidden != 1 )

	console.log(a.length)

	let n = 200
	let m = 12000

	a.
	renderRange( (a.length-m)-n, a.length-m )
	.server("html")

})
