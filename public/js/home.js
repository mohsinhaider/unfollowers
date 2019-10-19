const inputRow = document.querySelector('#input-row');
const submitButton = document.querySelector('#submit-button');
const usernameInput = document.querySelector('#username-input');

const isMobileClient = Helper.isMobileClient();

submitButton.addEventListener('click', () => {
    // Remove leading and trailing whitespace
    const handle = (usernameInput.value).trim();
    var isErrorFlashOn = false;

    if (handle) {
        if (isValidHandleFormat(handle)) {
            if (isErrorFlashOn) {

            }
        } else {
            if (!isErrorFlashOn) {
                insertErrorFlash();
                isErrorFlashOn = true;
            }
        }
    }
});


let isValidHandleFormat = (handle) => {
    const expression = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/);

    let hasSpaceChars = handle.indexOf(' ') !== -1;
    let hasSpecialChars = expression.test(handle);
    let exceedsMaxChars = handle.length > 30;

    if (hasSpaceChars || hasSpecialChars || exceedsMaxChars) {
        return false;
    }
    return true;
}

let insertErrorFlash = () => {
    let errorRow = document.createElement('div');
    errorRow.className = 'row';
    errorRow.id = 'error-row';
    errorRow.style.backfaceVisibility = 'hidden';
    errorRow.style.webkitBackfaceVisibility = 'hidden';

    let errorRowColumns = document.createElement('div');
    errorRowColumns.className = 'col s12';

    let errorDiv = document.createElement('div');
    errorDiv.className = 'round-corner'
    errorDiv.style.backgroundColor = '#f5cece';
    errorDiv.style.borderColor = 'red';
    errorDiv.style.borderStyle = 'solid';
    errorDiv.style.borderWidth = '1px';
    errorDiv.style.paddingTop = '20px';
    errorDiv.style.paddingBottom = '20px';
    errorDiv.style.paddingLeft = '15px';

    let errorFaIcon = document.createElement('i');
    errorFaIcon.className = 'fa fa-exclamation-triangle';
    errorFaIcon.style.paddingLeft = '5px';
    errorFaIcon.style.color = 'red';

    let errorText = document.createElement('b');
    if (isMobileClient) { 
        errorText.innerText = 'Oops! Is your handle typed right?';
    } 
    else { 
        errorText.innerText = 'Oops! Is your handle spelled correctly?';
    }

    errorText.style.paddingLeft = '10px';

    errorDiv.appendChild(errorFaIcon);
    errorDiv.appendChild(errorText);

    errorRowColumns.appendChild(errorDiv);
    errorRow.appendChild(errorRowColumns);

    errorRow.appendAfter(inputRow);
    Helper.fadeIn(errorRow);
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