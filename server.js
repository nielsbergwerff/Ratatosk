const express = require('express');
const app = new express();
const port = 80;

app.use(express.static('.'));

app.get('/', function(request, response){
    response.sendFile('index.html');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
