/*
 * Complete the 'maxProfit' function below.
 *
 * The function is expected to return an INTEGER.
 * The function accepts following parameters:
 *  1. INTEGER costPerCut
 *  2. INTEGER salePrice
 *  3. INTEGER_ARRAY lengths
 */

function maxProfit(costPerCut, salePrice, lengths) {
    // Write your code here
    let maxLength = Math.max(...lengths)
    //let saleLength = minLength
    
    let maxProfit = 0
    let currentRemainingLength = 0
    let currentTotalUniformRods = 0
    let currentProfit = 0
    let currentTotalCuts = 0
    
    for(let currentSaleLength = maxLength; currentSaleLength > 0; currentSaleLength--){
       for(let currentPieceIndex = 0; currentPieceIndex < lengths.length; currentPieceIndex++){
           currentRemainingLength = lengths[currentPieceIndex]
           
           while(currentRemainingLength >= currentSaleLength){
              if(salePrice*currentSaleLength < costPerCut){
                if(currentRemainingLength === currentSaleLength){
                  currentTotalCuts++  
                }

                currentRemainingLength = 0
              }
              else {
                currentTotalUniformRods++
                if(currentRemainingLength > currentSaleLength){
                    currentTotalCuts++
                }
                
                currentRemainingLength -= currentSaleLength
              }
           }
           
           currentRemainingLength = 0
       }
       
       currentProfit = (currentTotalUniformRods*currentSaleLength*salePrice) - (currentTotalCuts*costPerCut)
       
       if(currentProfit > maxProfit){
           maxProfit = currentProfit
       }
       
       currentTotalUniformRods = 0
       currentTotalCuts = 0
    }
    
    return maxProfit
}