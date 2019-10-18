const submitButton = document.querySelector('#submit-button');
const usernameInput = document.querySelector('#username-input');

console.log(usernameInput)

submitButton.addEventListener('click', () => {
    if (usernameInput.value) {
        console.log('hello');
    }
});


let cleanHandle = () => {
    
}

// axios({
//     method: 'post',
//     url: '/api/nonfollower',
//     data: {
//         username: 'mohsinwho'
//     }
// }).then((response) => {
//     console.log(response.data);
// }).catch((error) => {
//     console.log(error);
// });