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

      return adoptionInstance.getAdopters.call();
    }).then(function(adopters) {
      for (i = 0; i < adopters.length; i++) {
        if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-pet').eq(i).find('button')//.text('Adopt!').attr('disabled', true);
          //index.htmlの47,48も含む？

          //var fuga = $('.panel-pet').eq(i).find('button').text('Adopt!')//.attr('disabled', true);
          //console.log(fuga);
          //Adoption.solに同等の記述？

          /*
          $('.panel-pet').eq(i).find('.button1').text('adopt1')//.attr('disabled', true);
          var fuga = $('.panel-pet').eq(i).find('button').text('Adopt!')//.attr('disabled', true);
          console.log(fuga);
          var hoge = $('.panel-pet').eq(i).find('.button1').text('adopt1')//.attr('disabled', true);
          console.log(hoge);
          */
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });

  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));
    console.log(petId); //うまく表示される

    //pets.jsonからprice引っ張ってくる
    //var petPrice = parseInt($(event.target).data('price'));
    var petPrice = parseInt($(event.target).data('price'));
    console.log(petPrice); 
    //NaNが帰ってくる
    //petPrice, petName共にNaNが帰ってきた
    // -> petId('id'要素)のみ取得、出力できている
    // -> petIdと同じような処理が必要？
    // -> 120行目の処理か -> X
    // -> Adoption.solにpetIdと同等の記述をし、呼び出す

    var adoptionInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];
      //console.log(account)
      

      App.contracts.Adoption.deployed().then(function(instance) {
        adoptionInstance = instance;

        // Execute adopt as a transaction by sending account
        //petPriceを処理
        return adoptionInstance.adopt(petId, {from: account});
        
      }).then(function(result) {
        return App.markAdopted();
      }).catch(function(err) {
        console.log(err.message);
      });

      
    /*web3.eth.getBalance("0xe1dad35bf09ccf8219607510b032bdf783fdf263")
      .then(console.log);
    
    トランザクションを行った回数のlog
    web3.eth.getTransactionCount(account, (error, count) => {
      console.log(count);
    });

    web3.eth.getBalance(account, (error, balance) => {
      console.log(balance);
    });*/
    });
  },  
},
    

$(function() {
  $(window).load(function() {
    App.init();
  });
});
