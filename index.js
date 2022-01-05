//Dependencies
const Axios = require("axios")
const Fs = require("fs")

//Variables
const Self_Args = process.argv.slice(2)

var Self = {
    grab_index: 0,
    max: 0,
    results: []
}

//Functions
async function Grab(account_type){
    try{
        if(Self.grab_index === Self.max){
            console.log(`Finished grabbing ${Self.max} ${account_type} accounts.`)
            console.log(`Saving the results to ${Self_Args[2]}`)
            Fs.writeFileSync(Self_Args[2], Self.results.join("\n"), "utf8")
            console.log(`Results successfully saved to ${Self_Args[2]}`)
            process.exit()
        }
    
        console.log(`Grabbing ${account_type} account. Index: ${Self.grab_index}`)
    
        var response = await Axios({
            method: "GET",
            url: `https://opengen.dpkghub.com/api/generate.php?type=${account_type}`
        })
    
        response = response.data
    
        if(Self.results.indexOf(response) !== -1){
            console.log(`Unable to grab ${account_type} account, due to duplicate/error. Index: ${Self.grab_index}`)
            console.log("Retrying...")
            return Grab(account_type)
        }
    
        Self.results.push(response)
    
        Self.grab_index++
        return Grab(account_type)
    }catch{
        console.log(`Unable to grab ${account_type} account, due to duplicate/error. Index: ${Self.grab_index}`)
        console.log("Retrying...")
        return Grab(account_type)
    }
}

//Main
if(!Self_Args.length){
    console.log("Account types: Netflix, Spotify, NordVPN & Disney(Disney plus).")
    console.log("node index.js <account_type> <amount> <output>")
    process.exit()
}

if(isNaN(Self_Args[1])){
    console.log("amount is not a number.")
    process.exit()
}

if(!Self_Args[2]){
    console.log("Invalid output.")
    process.exit()
}

Self_Args[0] = Self_Args[0].toLowerCase()
Self.max = parseInt(Self_Args[1])

switch(Self_Args[0]){
    case "netflix":
        Grab("Netflix")
        break
    case "spotify":
        Grab("Spotify")
        break
    case "nordvpn":
        Grab("NordVPN")
        break
    case "disney":
        Grab("Disney")
        break
    default:
        console.log("Invalid account_type.")
        break
}