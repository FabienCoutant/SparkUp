SparkUp
==============
____
Alyra's 2021 Final Project.

## Contents
* [Technical Specifications](#Technical Specifications)
  * [Back-end](#Back-end)
  * [Front-end](#Front-end)
  * [Framework](#Framework)
  * [Versioning](#Versioning)
  * [Network](#Network)
* [Concept](#concept)
* [Installation](#Installation)
* [Configuration](#Configuration)
  * [Environment Parameters](#Environment Parameters)
    * [Back-end](#Back-end) 
    * [Front-end](#Front-end) 
  * [Deployment](#Deployment)
    * [Back-end](#Back-end)
    * [Front-end](#Front-end)
* [Run Front-end](#Run Front-end)
* [Tests](#Tests)
* [Events](#Events)
* [Contributors](#Contributors)

##Technical Specifications
___

This part list the development languages and libraries used during the project

### Back-end
* Solidity

### Front-end
* ReactJs
* Typescript
* Redux
* Redux-toolkit
* Web3
* Web3-react

### Framework
* Truffle unbox React

### Versioning
* Git
* Gitflow

### Network
* Ganache
* Ropsten
* Ethereum Mainnet


## Concept
___

**SparkUp** is a DApp with the goal of decentralizing the way of crowdfunding work and also to improve the funding
process. We believe that backers and creators must keep a link between them after fundraising. To do so, we developed a
DApp that allow creators to create Campaign that backers can contribute to in USDC.

In the case of a **successful fundraising** :

* each backer will get a **voting power which depend on their contribution**.
* To withdraw funds, the creator will have to make proposal to his contributors in order to justify the spending.
* If more that 50% of backers vote approve the withdrawal, than the creator is allowed to receive the amount he needs.

In case of a **unsuccessful fundraising** :

* each backer is authorized to withdraw their contribution

## Installation
___

* Install npm
* Clone this repository where you want : `git clone https://github.com/FabienCoutant/SparkUp.git`
* Move into the new folder `$cd SparkUp`
* Install the dependencies at the project's root folder : `npm install`
* Install the dependencies for the client site : `npm --prefix client/ install`

Then move to the configuration part.

## Configuration

---

### Environment Parameters

* #### Back-end

You must create an **.env** file in the project's root folder. This file must contain your Infura project ID and the
account's private key which will deploy the project.

```
PRIVATE_KEYS="YOUR_PRIVATE_KEY"
INFURA_KEY = "YOUR_INFURA_ID"
```

* #### Front-end

You also need to create an **.env** file in the project's client folder. This file only need your Infura project ID as
below:
*This configuration allow fetch data like the campaign list even if the user isn't connected*

```
REACT_APP_INFURA_KEY = "YOUR_INFURA_ID"
```

ℹ️ Take not that your value must be surrounded with double quotes.

### Deployment

You will first need to deploy the back-end (solidity files) and then the front.

* #### Back-end
  Take not that you need to be at the project's root folder.

    * Local Deployment (Ganache) : `npm truffle deploy --reset --network development`

    * Ropsten Deployment : `npm truffle deploy --reset --network ropsten`
      
    * Ethereum Deployment : `npm truffle deploy --reset --network mainnet`

* #### Front-End
  Nothing to Do

### Run Front-end
* Local Deployment : move into the client folder and run `npm run start` and then open your browser at the following url : https://localhost:3000/ 
* Ropsten : to interact with our DApp and smart-contract use the following url : 

## Tests

---
TODO

## Events

---
TODO



## Contributors

---

- [Rayane Loutfi](https://github.com/RayXpub)
- [Fabien Coutant](https://github.com/FabienCoutant)
