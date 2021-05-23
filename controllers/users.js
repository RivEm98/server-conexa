require('dotenv').config()/* esto es para las variables de entorno tambien es utilizado en el app.js */
const fs= require('fs')
const path = require('path')
const bcrypt = require('bcrypt')
const db = require("../data/users");
const jwt = require('jsonwebtoken')

module.exports = {
  create: (req, res) => {
    const {name, email, password} = req.body;
    const ids = db.map(user=>user.id)
    const maxId = Math.max(...ids)/* esto es para que las ids sean autoincrementables */
    let emailExist = false
    let expReg = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
    let isValid = expReg.test(email)
    let errors = {
      name:{msg:''},
      email:{msg:''},
      password:{msg:''}
    }
    name == ''?errors.name.msg='You must enter a name':''
    email == ''?errors.email.msg='You must enter a email':''
    password == ''?errors.password.msg='You must enter a password':''
    
    if(errors.name.msg > 0 || errors.email.msg || errors.password.msg){
      return res.send(errors)
    }
    if(!isValid == true){
      errors.email.msg='The email must be of type email'
      return res.send(errors)
    }

    db.map(user=>{
      if (user.email === email) {
        emailExist=true
      }
    })
    
    if(emailExist===false){
      let newUser = {
        id : maxId+1,
        name,
        email,
        password: bcrypt.hashSync(password, 10)
      }

      db.push(newUser)

      const token = jwt.sign(
        {
          id : newUser.id
        },
        process.env.SECRET,
        {
          expiresIn : 60
        }
      ) 

      fs.writeFileSync(path.join(__dirname,"..",'data',"users.json"),JSON.stringify(db),'utf-8');
  
      return res.send({newUser, token, msg:'successfull'})

    }else{
      errors.email.msg='The email is already registered'
      return res.send(errors)

    }
  },

  login: (req, res) => {
    const {email, password} = req.body;
    let emailExist = false
    let theUser = {}
    let errors = {
      email:{msg:''},
      pass:{msg:''}
    }
    
    db.map(user=>{
      if (user.email === email) {
        emailExist=true
        theUser=user
      }
    })

    const token = jwt.sign(
      {
        id : theUser.id,
        name : theUser.name
      },
      process.env.SECRET
    ) 

    if (emailExist === true) {
      let passIsOk= bcrypt.compareSync(password,theUser.password)
      if (passIsOk) {
        return res.send({msg:'welcome',email: theUser.email,name: theUser.name,token})
      }else{
        errors.pass.msg='Invalid password'
        return res.send(errors)
      }
    } else {
      errors.email.msg='The email  is not registered'
      return res.send(errors)
    }
  
  },
  users:(req,res)=>{
    res.send(db)
  }
};
