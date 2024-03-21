
const countValue = document.querySelector('#counter')

const increment = () => {
    //get the value from UI
    let value = parseInt(countValue.innerText);
    //increment the value
    value = value + 1;
    //set the value in UI
    countValue.innerText = value;
}


const decrement = () => {
    //get the value from UI
    let value = parseInt(countValue.innerText);
    //decrement the value
    value = value - 1; 
    //set the value in UI
    countValue.innerText = value;
}




