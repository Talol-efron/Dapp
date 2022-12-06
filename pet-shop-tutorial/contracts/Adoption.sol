pragma solidity ^0.5.16;
contract Adoption {
    address[16] public adopters;
    
    /*function adopt(uint petPrice) public returns(uint) {
        require(petPrice >= 0 && petPrice <= 15);
        adopters[petPrice] = msg.sender;
        return petPrice;
    }*/
    
    //コメントアウトしてもできちゃう問題(?)
    function adopt(uint petId) public returns(uint) {
        require(petId >= 0 && petId <= 15);
        //require -> 条件分岐的な。falseの場合ガス代発生を阻止できる（？）
        adopters[petId] = msg.sender;
        return petId;
    }



    /*function adopt(uint petId, uint petPrice) public returns(uint) {
        require(petId >= 0 && petId <= 15);
        adopters[petId] = msg.sender;
        adopters[petPrice] = msg.sender;
        return petId, petPrice;
    }*/  
    
    //未完成
    function calcBalance(uint balance, uint petPrice) public returns(uint) {
        require(balance - petPrice >= 0);
        balance = balance - petPrice;
        return balance;
    }

    function getAdopters() public view returns (address[16] memory) {
        return adopters;
    }

    //自作関数は"is not a function"というエラーが発生
    function initializeApp(defaultAccount, balance) {
        new Vue({
            el: '#js-app',
            data: {
            defaultAccount: defaultAccount, // 選択されているEhtereumアカウント
            //name: name,                     // トークンの名前
            //symbol: symbol,                 // トークンのシンボル
            balance: balance,               // トークンをいくら所持しているか
            to: "",                         // 送金先アドレス
            amount: 1,                      // 送金する量
            history: ""                     // 送金トランザクションのハッシュ
        },
        methods: {
        // 残高の表示を整形するメソッド
            showBalance: function(balance) {
                return (balance / 1e18).toFixed(2);
            },
            // 送金するメソッド
            send: function() {
                var $this = this;
                var sendAmount = this.amount * 1e18;
                contract.transfer(this.to, sendAmount, {from: defaultAccount}, function(err, txhash){
                    if (err) throw err;
                    $this.history = txhash;
                    contract.balanceOf(defaultAccount, function(err, balance){
                        $this.balance = balance;
                    });
                });
            }
        }
    })
}

    
}