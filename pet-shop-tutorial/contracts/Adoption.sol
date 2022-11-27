pragma solidity ^0.5.16;
contract Adoption {
    address[16] public adopters;

    function adopt(uint petPrice) public returns(uint) {
        require(petPrice >= 0 && petPrice <= 15);
        adopters[petPrice] = msg.sender;
        return petPrice;
    }
    
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
    
    function getAdopters() public view returns (address[16] memory) {
        return adopters;
    }
}