let USERNAME = require("os").userInfo().username

const fs      = require("fs")
const http    = require("http")
const path    = require("path")
const hash    = require("crypto").createHash
const sqlite  = require(`C:/Users/${USERNAME}/AppData/Roaming/npm/node_modules/sqlite`)
const sqlite3 = require(`C:/Users/${USERNAME}/AppData/Roaming/npm/node_modules/sqlite3`)
const dayjs   = require(`C:/Users/${USERNAME}/AppData/Roaming/npm/node_modules/dayjs`)
const _       = init()
const PORT    = 8080

let pc_name = require("os").hostname().toLowerCase()

;( async () => {

    if( !fs.readdirSync("C:/test").includes("History") ){

        fs.copyFileSync(`C:/Users/${USERNAME}/AppData/Local/Google/Chrome/User Data/Default/History`,
        "C:/test/History")

    }

    let a = await search("C:/test/History")

    //

    let b = fs.readFileSync("C:/test/test.txt","utf8").split("\n")

    //

    let t = JSON.parse( b.at(-1) ).time

    //

    a = a.filter( x => x.time >= t )

    a = a.map( x => ({ title:hexEncode(x.title),url:x.url,time:x.time,source:pc_name }) )

    a = a.map( x => JSON.stringify(x) )

    a = _.difference(a,b)

    /*for( let x of a )
    fs.appendFileSync("C:/test/test.txt", "\n" + x )*/

    const stream = fs.createWriteStream( "C:/test/test.txt" , { flags: "a" } )
    
    for( let x of a ) stream.write( "\n" + x, "utf8" )
    stream.end()

    setTimeout(function () {
      fs.unlinkSync("C:/test/History")
    }, 2000 )

})()

async function search(x){

    let table = []

    let db = await sqlite.open({filename:x,
    driver: sqlite3.Database
    })

    let rows = await db.all("SELECT * FROM urls")

    let max = rows.length

    for ( let [i,row] of rows.entries() ){

        if( row.last_visit_time != 0 && row.hidden != 1 )
        table.push({
        "title" : row.title,
        "url":row.url,
        "time": row.last_visit_time,
        })

    }

    table.sort( (a,b) => a.time - b.time )

    return table

}

function hexEncode(x){
    if( x === "" ) return ""
    let URI = encodeURIComponent(x).match(/\%.{2}|./g)
    .map( x => x[0] != "%" ? x.charCodeAt(0).toString(16) : x )
    .map( x => x.toLowerCase().replace("%","") )
    return URI.join("")
}

function hexDecode(x){
    if( x === "" ) return ""
    if( x.length % 2 != 0 ) throw "length is not valid"
    let hexes = x.match(/.{2}/g)
    return decodeURIComponent( hexes.map( x => "%"+x ).join("") )
}

function btime(x){
    return dayjs(Math.trunc(x/1000+Date.UTC(1601,0,1))).format("dddd DD MMMM YYYY HH:mm:ss")
}

function init(){

    require(`C:/Users/${USERNAME}/AppData/Roaming/npm/node_modules/dayjs/locale/fr`)
    dayjs.locale("fr")
    return require(`C:/Users/${USERNAME}/AppData/Roaming/npm/node_modules/lodash`)

}
