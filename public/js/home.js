const inputRow = document.querySelector('#input-row');
const submitButton = document.querySelector('#submit-button');
const usernameInput = document.querySelector('#username-input');

usernameInput.addEventListener('keyup', (event) => {
    event.preventDefault();
    if (event.keyCode === 13) {
        submitButton.click();
    }
});

submitButton.addEventListener('click', async () => {
    // Remove leading and trailing whitespace
    let handle = (usernameInput.value).trim();

    if (handle) {
        // Clear components when new interface request happens
        State.update('isNonfollowerTableOn', false, removeNonfollowersTable);
        State.update('isErrorFlashOn', false, removeErrorFlash);

        if (isValidHandleFormat(handle)) {
            // Check if user typed '@'
            handle = Helper.trimAtSymbol(handle);

            let nonfollowers = null;
            try {
                const userMetadata = await requestMetadata(handle);
                State.update('isProfileHeaderOn', true, () => renderProfileHeader(userMetadata));
                nonfollowers = await requestNonfollowers(userMetadata);
            }
            catch (error) {
                let fn = null;
                if (errorMessages.includes(error.message)) {
                    fn = () => renderErrorFlash(error.message);
                } else {
                    fn = renderErrorFlash;
                }
                State.update('isErrorFlashOn', true, fn);
                return;
            }
            State.update('isNonfollowerTableOn', true, () => renderNonfollowersTable(nonfollowers));
        } 
        else {
            State.update('isErrorFlashOn', true, renderErrorFlash);
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

let renderProfileHeader = (userMetadata) => {
    let profileHeaderRow = document.createElement('div');
    profileHeaderRow.className = 'row';
    profileHeaderRow.id = 'profile-header-row';

    let profileHeaderColumns = document.createElement('div');
    profileHeaderColumns.className = 'col s12';

    let profileHeaderDiv = document.createElement('div');
    profileHeaderDiv.id = 'profile-header';

    let profilePicture = document.createElement('img');
    profilePicture.src = userMetadata.metadata.profilePictureUrl;
    profilePicture.className = 'round-full';
    profilePicture.id = 'profile-picture';

    let profileHeaderTable = document.createElement('table');
    let profileHeaderTableRow = profileHeaderTable.insertRow();

    let followersCell = profileHeaderTableRow.insertCell(0);
    if (State.get('isMobileClient')) {
        followersCell.innerHTML = `<p><b>${userMetadata.metadata.followerCount}</b></p><p style="color: #999999">followers</p>`;
    }
    else {
        followersCell.innerHTML = `<p style="padding-left: 20%;"><b>${userMetadata.metadata.followerCount}</b></p><p style="padding-left: 20%; color: #999999;">followers</p>`;
    }
    followersCell.className = 'profile-header-cell';

    let profilePictureCell = profileHeaderTableRow.insertCell(1);
    profilePictureCell.innerHTML = profilePicture.outerHTML;
    if (State.get('isMobileClient')) {
        profilePictureCell.style.width = '50%'
    }
    else {
        profilePictureCell.style.width = '1%'
    }
    profilePictureCell.className = 'profile-header-cell';

    let followingCell = profileHeaderTableRow.insertCell(2);
    if (State.get('isMobileClient')) {
        followingCell.innerHTML = `<p><b>${userMetadata.metadata.followingCount}</b></p><p style="color: #999999">following</p>`;
    }
    else {
        followingCell.innerHTML = `<p style="padding-right: 20%;"><b>${userMetadata.metadata.followingCount}</b></p><p style="padding-right: 20%; color: #999999;">following</p>`;
    }
    followingCell.className = 'profile-header-cell';

    profileHeaderDiv.appendChild(profileHeaderTable);
    profileHeaderColumns.appendChild(profileHeaderDiv);
    profileHeaderRow.appendChild(profileHeaderColumns);

    profileHeaderRow.appendAfter(inputRow);
}

let renderErrorFlash = (errorMessage = '') => {
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
    errorDiv.style.paddingTop = '20px';
    errorDiv.style.paddingBottom = '20px';
    errorDiv.style.paddingLeft = '15px';

    let errorFaIcon = document.createElement('i');
    errorFaIcon.className = 'fa fa-exclamation-triangle';
    errorFaIcon.style.paddingLeft = '5px';
    errorFaIcon.style.color = 'red';

    let errorText = document.createElement('b');
    if (errorMessage) {
        errorText.innerText = errorMessage;
    }
    else if (State.get('isMobileClient')) { 
        errorText.innerText = 'Oops! Is your handle spelled right?';
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

let requestNonfollowers = async (userMetadata) => {
    const response = await axios.post('/api/nonfollower', userMetadata);

    if (response.status === 500) {
        throw new Error('Oops! Something went wrong, try again.');
    }

    // POST /api/nonfollower will return 200 with error property if handle does not exist
    if ('error' in response.data) {
        throw new Error(response.data.error);
    }

    return response.data;
}

let requestMetadata = async (handle) => {
    const response = await axios.get('/api/metadata', { params: { username: handle } });

    if (response.status === 500) {
        throw new Error('Oops! Something went wrong, try again.');
    }

    if (response.status === 200 && 'error' in response.data) {
        throw new Error(response.data.error);
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

    let profileHeaderRow = document.querySelector('#profile-header-row');
    nonfollowerRow.appendAfter(profileHeaderRow);
}

let removeNonfollowersTable = () => {
    let nonfollowersTable = document.querySelector('#nonfollower-row');
    nonfollowersTable.parentNode.removeChild(nonfollowersTable);
}