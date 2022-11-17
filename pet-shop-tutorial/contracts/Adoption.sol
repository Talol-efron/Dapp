pragma solidity ^0.5.16;
contract Adoption {
    address[16] public adopters;

    function adopt(uint petId) public returns(uint) {
        require(petId >= 0 && petId <= 15);
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