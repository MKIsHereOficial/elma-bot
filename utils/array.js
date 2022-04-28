module.exports.splitIntoChunk = (arr, chunk) => {
    let results = [];

    for (i=0; i < arr.length; i += chunk) {

        let tempArray;
        tempArray = arr.slice(i, i + chunk);
        
        results.push(tempArray);
    }

   return results;
}

module.exports.shuffle = (array) => {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}
