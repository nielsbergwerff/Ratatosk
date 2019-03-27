MD js-server\models
COPY NUL js-server\models\berichten.js
COPY NUL js-server\models\gebruikers.js
COPY NUL js-server\models\groepen.js
COPY NUL js-server\models\groepsleden.js

ECHO {>config.json
ECHO  "port": ,>>config.json
ECHO  "databaseHost": "",>>config.json
ECHO  "databasePort": ,>>config.json
ECHO  "user": "",>>config.json
ECHO  "password": "",>>config.json
ECHO  "database": "">>config.json
ECHO }>>config.json

CALL npm i
