[![Netlify Status](https://api.netlify.com/api/v1/badges/266deaf5-681e-49a4-9469-d558042b01b4/deploy-status)](https://app.netlify.com/sites/focused-aryabhata-5c2feb/deploys)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# Satellite.im

Satellite gives you peace of mind with end-to-end
encryption without sacrificing quality.
Stream in 4k, chat in 500kbs+, share 10GB files.

Browse the codebase fast: https://github1s.com/Satellite-im/Satellite

![](https://site.satellite.im/_nuxt/img/phonestack.fdf036e.png)

## Developing Locally

You must install [Node.JS](https://nodejs.org/en/download/) on your system prior to running the application. 

### Textile.io Setup
Because the application uses HMR it will refresh un-nessiarily so it is recommended to run Textile locally. 
You can use their Docker container which makes this very easy, information here: [Textile Docker](https://github.com/textileio/go-threads#running-threaddb).

Alternativley you can simply create a key for Textile and include it in your config. Creating a Textile account and generating keys is explained here: [Textile Account](https://docs.textile.io/hub/accounts/)

### Creating the config

You'll need to fill out a few things in the config, first create your config by running `cp src/config/config-example.js src/config/config.js`. 

**Next enter the following information:**

`env` - Switch to 'prod' unless you're using a local instance of Textile.

`textile.key` - Replace this with your Textile.io API key.

### Update & Install Dependancies

**Update Submodules**

`git submodule update --init --recursive`

**Install Deps.**

`yarn` or `npm install`

### Build Contracts (Currently Optional)

**Build Contracts**

Install Truffle `npm i -g truffle`

Build Contracts `cd src/contracts && truffle build`

### Running Satellite

**Start in Devmode**

`yarn dev` or `npm run dev`

Navigate to `http://localhost:8080`. (This should open automatically.)

In your browser, use something like metamask connected to the goerli testnet.


## Code Quality

## Documentation & Style Guide
Satellite is intended to be built by the community. PLEASE document all new methods with JSDoc clearly so that future developers can pick up and improve Satellite rapidly. We also use the Standard.js style guide. Maintain this style guide wherever possible.

### Single File Components
If a single file component exceeds 150 lines please split it into a three file component.

## Testing 

Nothing is here yet, that's a problem, if you'd love a great place to start we would love to setup some automated testing!

## Important Gotchas
This repository encompases all of Satellite's infastructure. There is no back-end API to store keys or anything really. With this in mind please be mindful that anything you add to the repository will be visible to the end user. Traditional secret key authentication into external APIs will expose those secrets to the public. 


## Loving the project?
We're probably hiring, if you've made it this far you're probably interested in the tech side. Please feel free to reach out and chat with us!
