process.EventEmitter = require("events");
var ftpd = require('ftpd');
var fs = require('fs');
var path = require('path');


// communicate with database to check ftp
const FtpAccount = require('./models/FtpAccount');

var keyFile;
var certFile;
var server;
var options = {
  host: process.env.IP || '127.0.0.1',
  port: process.env.PORT || 7002,
  tls: null,
};

if (process.env.KEY_FILE && process.env.CERT_FILE) {
  console.log('Running as FTPS server');
  if (process.env.KEY_FILE.charAt(0) !== '/') {
    keyFile = path.join(__dirname, process.env.KEY_FILE);
  }
  if (process.env.CERT_FILE.charAt(0) !== '/') {
    certFile = path.join(__dirname, process.env.CERT_FILE);
  }
  options.tls = {
    key: fs.readFileSync(keyFile),
    cert: fs.readFileSync(certFile),
    ca: !process.env.CA_FILES ? null : process.env.CA_FILES
      .split(':')
      .map(function(f) {
        return fs.readFileSync(f);
      }),
  };
} else {
  console.log();
  console.log('*** To run as FTPS server,                 ***');
  console.log('***  set "KEY_FILE", "CERT_FILE"           ***');
  console.log('***  and (optionally) "CA_FILES" env vars. ***');
  console.log();
}

server = new ftpd.FtpServer(options.host, {
  getInitialCwd: async function(connection, callback) {
    try {
      const ftp1 = await FtpAccount.findOne({ username: connection.username });
      if (!ftp1) {
        callback(null, '/');
        return;
      }
      var relativePath = ftp1.relative_path;
      if (relativePath == '') relativePath = 'anonymous';

      var f_path = process.cwd() + '/ftp_root/' + relativePath;
      console.log('~~~~~~~~~~~~~~~~~~~ hkg328 ~~~~~~~~~~~~', f_path);
      fs.exists(f_path, function(exists) {
        if (exists) {
          callback(null, f_path);
        } else {
          fs.mkdir(f_path, function(err) {
            if (err) {
              callback(null, '/');
            } else {
              callback(null, '/' + relativePath);
            }
          });
        }
      });

    } catch (err) {
      callback(null, '/');
    }
  },
  getRoot: async function(connection, callback) {

    try {
      // const ftp1 = await FtpAccount.findOne({ username: connection.username });
      // if (!ftp1) {
      //   callback(null, '/');
      //   return;
      // }
      // var relativePath = ftp1.relative_path;
      // if (relativePath == '') relativePath = 'anonymous';
      var rootPath = process.cwd() + '/ftp_root';
      fs.exists(rootPath, function(exists) {
        if (exists) {
          callback(null, rootPath);
        } else {
          fs.mkdir(rootPath, function(err) {
            if (err) {
              callback(null, '/'); // default to root
            } else {
              callback(err, rootPath);
            }
          });
        }
      });

    } catch (err) {
      callback(err, rootPath);
    }

    
  },
  pasvPortRangeStart: 1025,
  pasvPortRangeEnd: 1050,
  tlsOptions: options.tls,
  allowUnauthorizedTls: true,
  useWriteFile: false,
  useReadFile: false,
  uploadMaxSlurpSize: 7000, // N/A unless 'useWriteFile' is true.
  allowedCommands: ['APPE']
});

server.on('error', function(error) {
  console.log('FTP Server error:', error);
});

server.on('client:connected', function(connection) {
  var username = null;
  console.log('client connected: ' + connection.remoteAddress);
  connection.on('command:user', function(user, success, failure) {
    if (user) {
      username = user;
      success();
    } else {
      failure();
    }
  });
  connection.on('command:pass', async function(pass, success, failure) {
    console.log('~~~~~~~~~~~~~~ hkg password ~~~~~~~~~~~~~~', pass);
    // console.log('pass', pass);
    // console.log('success', success);
    // console.log('failure', failure);

    try {
      const user = await FtpAccount.findOne({
        username: username,
        password: pass,
      })
      if (user) {
        success(username);
      } else {
        failure();
      }
    }catch(err) {
      failure();
    }
  });
  connection.on('command:retr', async function(arg1) {
    console.log('HHHHHHHHHHHHHHHH', arg1);
  })
  connection.on('file:dele', async function(arg1) {
    console.log('delete the file with remote')
  })

});

server.debugging = 4;
server.listen(options.port);
console.log('Listening on port ' + options.port);