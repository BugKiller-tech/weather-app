process.EventEmitter = require("events");
var ftpd = require('ftpd');
var fs = require('fs');
var path = require('path');
var csv = require('csvtojson');
const moment = require('moment');



function isValidDate(str1, formatString = '') {

  if (formatString != '' ) {
    if (moment.utc(str1, formatString).isValid()) {
      return moment.utc(str1, formatString);
    }
  }

  if (moment.utc(str1).isValid()) {
    return moment.utc(str1);
  }
  
  if (moment.utc(str1, "DD/MM/YYYY HH:mm").isValid()) {
    return moment.utc(str1, "DD/MM/YYYY HH:mm");
  }

  if (moment.utc(str1, "DD/MM/YYYY").isValid()) {
    return moment.utc(str1, "DD/MM/YYYY");
  }
  return false;
}



var ftp_root = 'ftp_root';


// communicate with database to check ftp
const FtpAccount = require('./models/FtpAccount');
const WeatherStation = require('./models/WeatherStation');
const DataCollection = require('./models/DataCollection');
const DataProcessing = require('./models/DataProcessing');
const DataPoint = require('./models/DataPoint');

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

      var f_path = process.cwd() + `/${ftp_root}/` + relativePath;
      // console.log('hkg328 ~~~~~~~~~~~~', f_path);

      fs.exists(f_path, function(exists) {
        if (exists) {
          callback(null, relativePath);
        } else {
          fs.mkdir(f_path, function(err) {
            if (err) {
              console.log('CAN NOT CREATE THE DIRECTORY', f_path);
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
      var rootPath = process.cwd() + `/${ftp_root}`;
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
    console.log('hkg328 password check -----', pass);
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

  connection.on('open', function(fd) {
    console.log('hkghkghkg -------  open open.');
  })

  connection.on('file:stor', async function(type, info) {
    console.log('------------- json file is uploaded ----------------');
    console.log('ARGS  ', type, info );

    if (type == 'close') {
      // console.log('file size is', info.filesize);
      // console.log('file name is', info.file);

      let filePath = path.join(__dirname, `${ftp_root}${info.file}`);
      let isExist = fs.existsSync(filePath);
      if (!isExist) {
        return;
      }

      let ftpUsername = info.user
      let ftpAccount = await FtpAccount.findOne({ username: ftpUsername })
      if (!ftpAccount) { return }

      let weatherStation = await WeatherStation.findOne({ ftp: ftpAccount._id });
      if (!weatherStation) {
        return;
      }
      // console.log(weatherStation);
      let keys = weatherStation.csv_data_format.split(',').map(item => {
        return item.trim(); 
      });

      let dataPoints = await DataPoint.find({ 'relations': { $elemMatch: { weatherStation: weatherStation._id } } });
      let dataProcessingKeys = [];
      let dataProcessingTimeKeys = [];
      if (dataPoints) {
        dataPoints.map(item => {
          // let found = item.relations.find(rel => {
          //   return rel.weatherStation.equals(weatherStation._id);
          // });
          // dataProcessingKeys.push({
          //   name: item.name,
          //   colName: found.colName
          // });

          item.relations.map(item1 => {
            if (item1.weatherStation.equals(weatherStation._id)) {
              if (item.name != 'time') {
                dataProcessingKeys.push({
                  name: item.name,
                  colName: item1.colName
                });
              } else {
                dataProcessingTimeKeys.push({
                  colName: item1.colName,
                  dateFormatString: item1.dateFormatString,
                });
              }
            }
          })
        })
      }
      console.log('~~~~~  DataProcessing', dataProcessingKeys);

      // console.log(keys);
      csv({ output: 'csv' }).fromFile(filePath)
      .then((data)=> {
        data.map(async item => {
          // saving to data collection
          let collection = { station: weatherStation._id };

          // saving to data processing
          let collection1 = { station: weatherStation._id };

          if (item.length >= keys.length) {
            for (let i = 0; i< keys.length; i++) {
              collection[keys[i]] = item[i];
            }
            let temp = await DataCollection.findOne(collection);
            if (!temp){
              await DataCollection.create(collection);
            }

            dataProcessingKeys.map(dPItem => {
              let value = collection[dPItem.colName];
              collection1[dPItem.name] = value;
            })

            var timeValue = new Date();
            if (dataProcessingTimeKeys.length == 2 ) {
              let dateOrTime1 = collection[dataProcessingTimeKeys[0].colName]; let dateTime1FormatString = collection[dataProcessingTimeKeys[0].dateFormatString];
              let dateOrTime2 = collection[dataProcessingTimeKeys[1].colName]; let dateTime2FormatString = collection[dataProcessingTimeKeys[0].dateFormatString];
              console.log('This pretty cool feature to make correct time from the multiple columns', dateOrTime1, dateOrTime2);

              if (!isValidDate(dateOrTime1, dateTime1FormatString) && isValidDate(dateOrTime2, dateTime2FormatString)) {
                let temp = dateOrTime1;    dateOrTime1 = dateOrTime2;    dateOrTime2 = temp;
                temp = dateTime1FormatString;    dateTime1FormatString = dateTime2FormatString;    dateTime2FormatString = temp;
              }
              if (isValidDate(dateOrTime1, dateTime1FormatString) && !isValidDate(dateOrTime2, dateTime2FormatString)) {
                timeValue = isValidDate(dateOrTime1, dateTime1FormatString).toDate();
                console.log('testing purpose', isValidDate(dateOrTime1, dateTime1FormatString), timeValue);
                let hms = dateOrTime2.split(':');
                if (hms.length >= 2) {  timeValue.setUTCHours( parseInt(hms[0]), parseInt(hms[1]), 0 ); }
              }
            } else if ( dataProcessingTimeKeys.length == 1 ) {
              if (!isValidDate(dateOrTime1, dateTime1FormatString)) {
                timeValue = new Date();
                let hms = dateOrTime1.split(':');
                if (hms.length >= 2) {  timeValue.setUTCHours( parseInt(hms[0]), parseInt(hms[1]), 0 ); }
              } else {
                timeValue = new Date(Date.parse(dateOrTime1));
              }              
            }
            collection1['time'] = timeValue;
            try {
              temp = await DataProcessing.findOne(collection1);
              if (!temp) {
                await DataProcessing.create(collection1);
              }
            } catch (err) {
              
            }
          }
          
        })        
      });
    }
  })

});

server.debugging = 4;
server.listen(options.port);
console.log('Listening on port ' + options.port);