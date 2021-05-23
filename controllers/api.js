const Axios = require('axios')
const {stringify } = require('flatted')
module.exports={
    posts:(req,res)=>{
        Axios.get("https://jsonplaceholder.typicode.com/posts")
        .then(data=>{ res.send(data.data) })
        .catch(e=>{ console.log(e) })
    },
    photos:(req,res)=>{
        Axios.get("https://jsonplaceholder.typicode.com/photos")
        .then(data=>{ res.send(data.data) })
        .catch(e=>{ console.log(e) })
    }
}