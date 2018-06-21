const randomstring = require('randomstring');

for(var i=0; i<10;i++) {
  const username = randomstring.generate({
    length: 10,
    charset: 'numeric'
  });
  const password = randomstring.generate({
    length: 10,
    charset: 'alphabetic'
  })
  console.log(username, password);
}