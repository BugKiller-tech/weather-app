# Weather App


## Getting Started

Thanks for visiting here.


### Installing

clone this repository and goto server folder

```
cd server
npm install
```

And run

```
npm start
```

If you want to run as permanant use the pm2

```
pm2 start ./bin/www
```
 > Note: To install pm2 execute this command
 >  ``` npm install pm2 -g ```


## ~~~~~ Config ~~~~~
> change the database url    server/config/db.js
```
module.exports = {
  MONGODB_URL: 'blahblahblah..'
}
```

> Change super admin credential    server/config/superadmin.js
```
module.exports = {
  username: 'superadmin',
  password: 'superadmin'
}
```






## Built With


## Authors

* **BugKiller** - 

## License

This project is licensed under the MIT License 

## Acknowledgments

* Hat tip to anyone who's code was used
* Inspiration
* etc
