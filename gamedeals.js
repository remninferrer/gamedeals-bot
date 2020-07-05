const fetch = require("node-fetch");
module.exports = {
	name: 'gamedeals',
	description: 'Look up game deals in Steam using CheapShark API',
	execute(msg, args) {
        const getDeals = async () => {         
                // https://www.cheapshark.com/api/1.0/deals?storeID=1
                fetch('https://www.cheapshark.com/api/1.0/deals?storeID=1').then(response => response.json()).then(data => {
                        msg.channel.send(data.length);
                        // print out all games on sale
                        if ((args[0].localeCompare("all")) == 0){ 
                              for (var i = 0; i < data.length; i++) {                             
                                      msg.channel.send(data[i].internalName + " is " + ~~data[i].savings + "% off (currently $" + data[i].salePrice +
                                      ", normal price is $" + data[i].normalPrice + ") " + data[i].steamRatingText)
                              }
                        }
                        
                        // check if specific game is on sale and print it out
                        // else, state that game is not on sale or does not exist
                        else if((args[0].localeCompare("check")) == 0){
                                var exists = 0;
                                for (var i = 0; i < data.length; i++) {
                                        if(data[i].internalName.includes(args[1].toUpperCase()) == true){
                                                msg.channel.send(data[i].internalName + " is " + ~~data[i].savings + "% off (currently $" + data[i].salePrice +
                                                ", normal price is $" + data[i].normalPrice + ") " + data[i].steamRatingText)
                                                exists = 1;
                                        }
                                } 
                                if(exists == 0){
                                        msg.channel.send("Game was not found or is currently not on sale.")
                                }
                        }

                        // prints out all games that are overwhelmingly positive
                        else if((args[0].localeCompare("op")) == 0){
                                for (var i = 0; i < data.length; i++) {
                                        // takes care of null entries and prevents search from preemptively ending
                                        if(data[i].steamRatingText == null || data[i].steamRatingText == 0){}
                                        else if((data[i].steamRatingText.localeCompare("Overwhelmingly Positive")) == 0){
                                                msg.channel.send(data[i].internalName + " is " + ~~data[i].savings + "% off (currently $" + data[i].salePrice +
                                                ", normal price is $" + data[i].normalPrice + ") " + data[i].steamRatingText)
                                        }
                                } 
                        }
                })                 
        }
        getDeals();
	},
};
