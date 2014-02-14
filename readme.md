# Simple (i.e. no dependency manager) Front-end boilerplate/starter

_Not every front-end is an application but all front-ends can benefit from advancements made in front-end development_

## Prerequisites

#####Installed on your computer the following:

- [Git](http://git-scm.com)
- [Node](http://nodejs.org) & [npm](https://npmjs.org/) (npm is install when with node, use installer from site)

#####Installed globally the following npm packages:

- [bower](http://bower.io) `$ sudo npm install -g bower`
- [gulp](http://gulpjs.com) `$ sudo npm install -g grunt-cli`

## Installation/setup

```
# install dependencies
$ npm install
$ bower install

# run gulp
$ gulp production

# start the server
$ node server.js
# application runs at http://localhost:3044
```

## Build code & start server

```
# run gulp
$ gulp build

# start the server
$ node server.js
# application runs at http://localhost:3044
```

## Build production code & start production server

```
# run gulp
$ gulp production

# start the server
$ node serverProduction.js
# application runs at http://localhost:3045
```
