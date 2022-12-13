App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate'); 

      for (i = 0; i < data.length; i++) {
        //15匹分のdataを格納 -> コメントアウトするとすべて表記が初期値になる
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-price').text(data[i].price);
        petTemplate.find('.btn-adopt').attr('data-price', data[i].price);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);
        petsRow.append(petTemplate.html());
        //console.log(data[i])
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
  // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    } 
  // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
  // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Adoption.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var AdoptionArtifact = data;
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);
    
      // Set the provider for our contract
      App.contracts.Adoption.setProvider(App.web3Provider);
    
      // Use our contract to retrieve and mark the adopted pets
      return App.markAdopted();
    });
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function() {
    var adoptionInstance;

    App.contracts.Adoption.deployed().then(function(instance) {
      adoptionInstance = instance;

      return adoptionInstance.getAdopters.call();//.call()でトランザクション開始(?)
    }).then(function(adopters) {
      for (i = 0; i < adopters.length; i++) {
        if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-pet').eq(i).find('button')//.text('Adopt!').attr('disabled', true);
          //adopter[i] -> '0x'
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  handleAdopt: function(event) {
    event.preventDefault();//デフォルトの動作をキャンセルする

    var petId = parseInt($(event.target).data('id'));
    console.log(petId); //うまく表示される

    //17行目btn-adoptに変更後solved
    var petPrice = parseInt($(event.target).data('price'));
    console.log(petPrice); 

    var adoptionInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];
      var recievAddr = "0x52DDcF80f1372e7fd3b16944ECE6B2D762327145";
      console.log(account);
      console.log(recievAddr);

      

      App.contracts.Adoption.deployed().then(function(instance) {
        adoptionInstance = instance;

        // Execute adopt as a transaction by sending account
        return adoptionInstance.adopt(petId, {from: account});
        
      }).then(function(result) {
        return App.markAdopted();
      }).catch(function(err) {
        console.log(err.message);
      });

      web3.eth.getBalance(account, (error, bl) => {
        var balance = bl.c[0];
        console.log(balance);
      
      //ERROR!
      //adoptionInstance.calcBalance is not a function
      /*App.contracts.Adoption.deployed().then(function (instance) {
        adoptionInstance = instance;

        // Execute adopt as a balance by sending account
        //petPriceを処理
        //return adoptionInstance.calcBalance(balance, petPrice, { from: account });
        return adoptionInstance.initalizeApp(account, balance)
      }).then(function (result) {
        return App.markAdopted();
      }).catch(function (err) {
        console.log(err.message);
      });*/

        var send = web3.eth.sendTransaction({ from: account, to: recievAddr, value: 10000 } );
        console.log(send);
    });

      
    /*web3.eth.getBalance("0xe1dad35bf09ccf8219607510b032bdf783fdf263")
      .then(console.log);
    
    トランザクションを行った回数のlog
    web3.eth.getTransactionCount(account, (error, count) => {
      console.log(count);
    });*/    
    });
  },  
},
    

$(function() {
  $(window).load(function() {
    App.init();
  });
});
