http = require 'http'
str = 'Hello World'
varname = false
http.createServer (req, res) ->
  str = 'Hello World!'
  res.writeHead 200
  res.write 'First ' if varname?
  res.end str unless false
.listen 4000