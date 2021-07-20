# SparkUp 
[![Coverage Status](https://coveralls.io/repos/github/FabienCoutant/SparkUp/badge.svg?branch=master)](https://coveralls.io/github/FabienCoutant/SparkUp?branch=master)

Alyra's 2021 Final Project.


## Contents
* [Concept](#concept)
* [Design pattern decisions](#Design-pattern-decisions)
* [Technical Specifications](#Technical-Specifications)
  * [Front end coding languages](#Front-end-coding-languages)
  * [Front end libraries](#Front-end-libraries)
  * [Back end coding language](#Back-end-coding-language)
  * [Framework](#Framework)
  * [Versioning](#Versioning)
  * [Code quality libraries](#Code-quality-libraries)
  * [Other libraries](#Other-libraries)
  * [Network](#Network)
* [Installation](#Installation)
* [Configuration](#Configuration)
  * [Environment Parameters](#Environment-Parameters)
    * [Back end](#Back-end-configuration) 
    * [Front end](#Front-end-configuration) 
  * [Deployment](#Deployment)
    * [Back end](#Back-end)
    * [Front end](#Front-end)
* [Tests](#Tests)
* [Avoiding common attacks](#Avoiding-common-attacks)
* [Events](#Events)
* [Contributors](#Contributors)

## Concept

**SparkUp** is a DApp with the goal of decentralizing the way of crowdfunding work and also to improve the funding
process. We believe that backers and creators must keep a link between them after fundraising. To do so, we developed a
DApp that allow creators to create Campaign that backers can contribute to in USDC.

In the case of a **successful fundraising** :

* each backer will get a **voting power which depend on their contribution**.
* To withdraw funds, the creator will have to make proposal to his contributors in order to justify the spending.
* If more that 50% of backers vote approve the withdrawal, than the creator is allowed to receive the amount he needs.

In case of a **unsuccessful fundraising** :

* each backer is authorized to withdraw their contribution

## Design pattern decisions

This part is explains in detail [here](#DESIGN_PATTERN_DECISIONS.md)

## Technical Specifications

This part list the main development languages and libraries used during the project :

### Front end coding languages
* ReactJs
* Typescript

### Front end libraries
* Redux
* Redux-toolkit
* Web3
* Web3-react
* Bootstrap v5

### Back end coding language
* Solidity

### Framework
* Truffle unbox React

### Versioning
* Git
* Gitflow

### Code quality libraries
* Coveralls
* Solidity-coverage
* Travis
* Codechecks

### Other libraries
* Solidity-docgen
* Eth-gas-reporter

### Network
* Ganache
* Ropsten
* Ethereum Mainnet

## Installation

* Install npm
* For local used : install ganache and run it on port **7545** and network ID **1337**
* Clone this repository where you want : `git clone https://github.com/FabienCoutant/SparkUp.git`
* Move into the new folder `cd SparkUp`
* Install the dependencies at the project's root folder : `npm install`
* Install the dependencies for the client site : `npm --prefix client/ install`

Then follow the configuration part.

## Configuration

### Environment Parameters

* #### Back end configuration

You must create an **.env** file in the project's root folder. This file must contain your Infura project ID and the
account's private key which will deploy the project.

```
PRIVATE_KEYS="YOUR_PRIVATE_KEY"
INFURA_KEY = "YOUR_INFURA_ID"
```
:white_check_mark: Take not that your value must be surrounded with double quotes.

* #### Front end configuration

You also need to create an **.env** file in the project's client folder. This file only need your Infura project ID as
below:
*This configuration allow fetch data like the campaign list even if the user isn't connected*

```
REACT_APP_INFURA_KEY = "YOUR_INFURA_ID"
```

:white_check_mark: Take not that your value must be surrounded with double quotes.

### Deployment

You will first need to deploy the back-end (solidity files) and then the front.

* #### Back end 
  Take not that you need to be at the project's root folder.

    * Local Deployment (Ganache) : `npm truffle deploy --reset --network development`
    * Ropsten Deployment : `npm truffle deploy --reset --network ropsten`
    * Ethereum Deployment : `npm truffle deploy --reset --network mainnet`

:white_check_mark: Take not that our smart-contracts are deployed on Ropsten at the addresses defined [here](#DEPLOYED_ADDRESSES.md)

* #### Front End
  * Local Deployment : move into the client folder and run `npm run start` and then open your browser at the following url : https://localhost:3000/
  * Ropsten : in order to interact with our DApp and smart-contract use the following url :
  

## Tests

The solidity part has been tested following the TDD approach. More details on what has been tested and why explained [here](#TESTS_EXPLANATIONS.md).
To run the tests you have several options but both need to be launch in the project's root folder :
* Using the truffle commands on local (ganache on port **7545**) or testnet :
  * If you installed truffle globally : `truffle test`
  * Else : `npx truffle test`
* Using the command created that launch a shadow ganache already configured :
`npm run test`
* Running test with code coverage :
`npm run coverage`
* Running test with a report of gas consumed by the smart-contracts and each function :
`npm run gas`

:white_check_mark: Take not that by using CI/CD, we perform tests with **code coverage** and **gas report** on each Pull Request


## Avoiding common attacks

This part is explains in detail [here](#/AVOIDING_COMMON_ATTACKS.md)

## Events

TODO


## Contributors

- [Rayane Loutfi](https://github.com/RayXpub)
- [Fabien Coutant](https://github.com/FabienCoutant)
