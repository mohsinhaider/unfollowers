const inputRow = document.querySelector('#input-row');
const submitButton = document.querySelector('#submit-button');
const usernameInput = document.querySelector('#username-input');

const isMobileClient = Helper.isMobileClient();
let isErrorFlashOn = false;
let isNonfollowerTableOn = false;

submitButton.addEventListener('click', async () => {
    // Remove leading and trailing whitespace
    const handle = (usernameInput.value).trim();

    if (handle) {
        State.update(removeNonfollowersTable, 'isNonfollowerTableOn', false);
        State.update(removeErrorFlash, 'isErrorFlashOn', false);

        if (isValidHandleFormat(handle)) {
            let nonfollowers = null;
            try {
                nonfollowers = await requestNonFollowers(handle);
            }
            catch (error) {
                State.update(renderErrorFlash, 'isErrorFlashOn', true);
                return;
            }
            State.update(() => renderNonfollowersTable(nonfollowers), 'isNonfollowerTableOn', true);
        } 
        else {
            if (!isErrorFlashOn) {
                State.update(renderErrorFlash, 'isErrorFlashOn', true)
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

let renderErrorFlash = () => {
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

let removeErrorFlash = () => {
    let errorFlash = document.querySelector('#error-row');
    errorFlash.parentNode.removeChild(errorFlash);
}

let requestNonFollowers = async (handle) => {
    const response = await axios.post('/api/nonfollower', { username: handle });

    // POST /api/nonfollower will return 200 with error property if handle does not exist
    if ('error' in response.data) {
        throw new Error();
    }

    return response.data;
}

let renderNonfollowersTable = (nonfollowers) => {
    let nonfollowerRow = document.createElement('div');
    nonfollowerRow.className = 'row';
    nonfollowerRow.id = 'nonfollower-row';

    let nonfollowerColumns = document.createElement('div');
    nonfollowerColumns.className = 'col s12';

    let nonfollowerTable = document.createElement('table');

    let rowCount = 0;
    nonfollowers.forEach(nonfollower => {
        let nonfollowerMetadataRow = nonfollowerTable.insertRow(rowCount);

        let profilePicCell = nonfollowerMetadataRow.insertCell(0);
        profilePicCell.style.width = '50px';

        let profilePic = document.createElement('img');
        profilePic.src = nonfollower.profilePicUrl;
        profilePic.style = 'border-radius: 50%;'
        profilePic.style.width = '50px';
        profilePic.style.height = '50px';

        profilePicCell.style.width = '50px';
        profilePicCell.innerHTML = profilePic.outerHTML;

        let handleRow = nonfollowerMetadataRow.insertCell(1);
        handleRow.innerHTML = nonfollower.username;

        rowCount++;
    });

    nonfollowerColumns.appendChild(nonfollowerTable);
    nonfollowerRow.appendChild(nonfollowerColumns);
    nonfollowerRow.appendAfter(inputRow);
}

let removeNonfollowersTable = () => {
    let nonfollowersTable = document.querySelector('#nonfollower-row');
    nonfollowersTable.parentNode.removeChild(nonfollowersTable);
}