const crypto = require('crypto')

module.exports = function(app,db){
//standaard wordt gecheckt of de gebruiker ingelogt is
//zo ja wordt hij naar de chatomgeving gestuurd
//zo niet wordt hij naar de loginpagina gestuurd
app.get('/',(req,res)=>{
  if(req.session.loggedIn==='true')res.sendFile('index.html',{root:'../html'})
  else res.redirect('/login')
})

//bij post wordt login gegevens gecheckt en session waardes gezet
app.route('/login')
  .get((req,res)=>{
    res.sendFile('login.html',{root:'../html'})
    req.session.loginError = ''
  })
  .post((req,res)=>{
    var username=req.body.username,
        password=req.body.password
    var hash = crypto.createHash('sha256').update(password).digest('hex')
    //zoekt in database met de login gegevens
    db.findUser(username,hash,(result)=>{
      if(result){
        req.session.loggedIn = 'true'
        req.session.user = username
        res.redirect('/')
      } else {
        res.redirect('/login')
        req.cookies.loginError = "Foute gebruikersnaam of wachtwoord"
      }
    })
  })

app.post('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/login')
})}
