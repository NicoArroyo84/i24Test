# i24 Technical Test

This technical test imitates a Google search page with both web and images results.

Please bear in mind due free Google Search API limitations, the test has some restrictions. Pagination has been limited to 10
as it is the maximun records per query allowed. For the same reason the total amount of results are limited to 100.

Also, the limit of queries a day is 100 so at some point the endpoint will no longer send the expected results for 24 hours.

## Summary


### Prerequisities

Nodejs npm need to be installed.
To install gulp and bower if they are not installed yet
npm install -g gulp
npm install -g bower

### Installing

- Clone the git project.
```
git clone https://github.com/NicoArroyo84/i24Test
```
- Get in to the cloned folder.
```
cd i24Test
```
- Check node,npm, gulp and bower are installed
```
node --version && npm --version && gulp --version && bower --version
```
- Install dependencies.
```
npm install
bower install
```
- Run the project
```
gulp serve
```

## Author

* Nicolas Arroyo
