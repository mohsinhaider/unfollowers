const inputRow = document.querySelector('#input-row');
const submitButton = document.querySelector('#submit-button');
const usernameInput = document.querySelector('#username-input');

submitButton.addEventListener('click', async () => {
    // Remove leading and trailing whitespace
    let handle = (usernameInput.value).trim();
    let currentUser = State.get('currentHandle');

    if (handle) {
        // Check if user typed '@'
        handle = Helper.trimAtSymbol(handle);

        // Clear components when new interface request happens
        State.update(State.states["IS_ERROR_FLASH_ON"], false, removeErrorFlash);

        let isHandleSame = currentUser === handle;
        if (!isHandleSame) {
            State.update(State.states["IS_PROFILE_HEADER_ON"], false, removeProfileHeader);
            State.update(State.states["IS_NONFOLLOWER_TABLE_ON"], false, removeNonfollowersTable);
            State.update(State.states["IS_TUTORIAL_ACTIVE"], false, removeTutorial);
        }
        else { // User submitted handle that was just processed by Straws servers
            // No scroll below, since a user's results should be already rendered.
            State.update(State.states["IS_ERROR_FLASH_ON"], true, () => renderErrorFlash(`Woops! You just submitted that.`));
            return;
        }

        if (isValidHandleFormat(handle)) {
            let nonfollowers = null;
            try {
                State.update(State.states["IS_SUBMIT_BUTTON_DISABLED"], true, () => disableSubmitButton());
                State.update(State.states["IS_LOADING_ANIMATION_ON"], true, () => renderProfileHeaderLoadingAnimation());
                const userMetadata = await requestMetadata(handle);

                // Past this point, the user is confirmed to be public. State "currentHandle" is updated with this user.
                State.update(State.states["CURRENT_HANDLE"], handle);
                State.update(State.states["IS_LOADING_ANIMATION_ON"], false, () => removeProfileHeaderLoadingAnimation());
                State.update(State.states["IS_PROFILE_HEADER_ON"], true, () => renderProfileHeader(userMetadata));

                State.update(State.states["IS_LOADING_ANIMATION_2_ON"], true, () => renderNonfollowersTableLoadingAnimation());
                scrollIntoLoadingAnimation2();
                nonfollowers = await requestNonfollowers(userMetadata);
                State.update(State.states["IS_LOADING_ANIMATION_2_ON"], false, () => removeNonfollowersTableLoadingAnimation());

                State.update(State.states["IS_NONFOLLOWER_TABLE_ON"], true, () => renderNonfollowersTable(nonfollowers));
            }
            catch (error) {
                State.update(State.states["IS_LOADING_ANIMATION_ON"], false, () => removeProfileHeaderLoadingAnimation());
                State.update(State.states["IS_LOADING_ANIMATION_2_ON"], false, () => removeNonfollowersTableLoadingAnimation());
                State.update(State.states["CURRENT_HANDLE"], undefined);

                let fn = null;
                if (errorMessages.includes(error.message)) {
                    fn = () => renderErrorFlash(error.message);
                } else {
                    fn = renderErrorFlash;
                }
                State.update(State.states["IS_ERROR_FLASH_ON"], true, fn);
                scrollIntoErrorFlash();

                // Not my proudest moment :(
                if (error.message === 'Oops! Your profile must be public to use Straws.') {
                    State.update(State.states["IS_TUTORIAL_ACTIVE"], true, renderTutorial);
                }

                return;
            }
            finally {
                State.update(State.states["IS_SUBMIT_BUTTON_DISABLED"], false, () => enableSubmitButton());
            }
        } 
        else {
            State.update(State.states["IS_ERROR_FLASH_ON"], true, renderErrorFlash);
            scrollIntoErrorFlash();
            State.update(State.states["CURRENT_HANDLE"], undefined);
        }
    }
});

usernameInput.addEventListener('keyup', (event) => {
    event.preventDefault();
    if (event.keyCode === 13) {
        submitButton.click();
    }
});

let isValidHandleFormat = (handle) => {
    const expression = new RegExp(/[~`!#$%\^&%^£€¥•*+=\-\[\]\\';,/{}|\\":<>\?]/);

    let hasSpaceChars = handle.indexOf(' ') !== -1;
    let hasSpecialChars = expression.test(handle);
    let exceedsMaxChars = handle.length > 30;

    if (hasSpaceChars || hasSpecialChars || exceedsMaxChars) {
        return false;
    }
    return true;
}

let enableSubmitButton = () => {
    submitButton.disabled = false;
}

let disableSubmitButton = () => {
    submitButton.disabled = true;
}

let scrollIntoErrorFlash = () => {
    document.querySelector('#error-row').scrollIntoView({
        behavior: 'smooth'
    });
}

let scrollIntoLoadingAnimation2 = () => {
    document.querySelector('#loading-animation2').scrollIntoView({
        behavior: 'smooth'
    });
}

let renderNonfollowersTableLoadingAnimation = () => {
    let animationImg = document.createElement('img');
    animationImg.id = 'loading-animation2';
    animationImg.src = '/img/loading.gif';
    animationImg.style.width = '137px';
    animationImg.style.height = '187px';
    animationImg.style.margin = '0px auto';
    animationImg.style.display = 'block';

    let profileHeaderRow = document.querySelector('#profile-header-row');
    animationImg.appendAfter(profileHeaderRow);
}

let removeNonfollowersTableLoadingAnimation = () => {
    let animationDiv = document.querySelector('#loading-animation2');
    animationDiv.parentNode.removeChild(animationDiv);
}

let renderProfileHeaderLoadingAnimation = () => {
    let animationDiv = document.createElement('div');
    animationDiv.id = 'loading-animation';
    animationDiv.appendAfter(inputRow);
}

let removeProfileHeaderLoadingAnimation = () => {
    let animationDiv = document.querySelector('#loading-animation');
    animationDiv.parentNode.removeChild(animationDiv);
}

let renderProfileHeader = (userMetadata) => {
    // Set up materialize row and columns
    let profileHeaderRow = document.createElement('div');
    profileHeaderRow.className = 'row';
    profileHeaderRow.id = 'profile-header-row';
    let profileHeaderColumns = document.createElement('div');
    profileHeaderColumns.className = 'col s12';

    // Create div and table to hold the 3 cells: followers, profile pic, and following.
    let profileHeaderDiv = document.createElement('div');
    profileHeaderDiv.id = 'profile-header';
    let profileHeaderTable = document.createElement('table');
    let profileHeaderTableRow = profileHeaderTable.insertRow();

    // Create 'XYZ followers' cell
    let followersCell = profileHeaderTableRow.insertCell(0);
    followersCell.className = 'profile-header-cell';

    let followersCellCountParagraph = document.createElement('p');
    followersCellCountParagraph.id = 'followers-cell-count-paragraph';

    let followersCellBold = document.createElement('b');
    followersCellBold.innerText = `${userMetadata.metadata.followerCount}`

    let followersCellSubtextParagraph = document.createElement('p');
    followersCellSubtextParagraph.id = 'followers-cell-subtext-paragraph';
    followersCellSubtextParagraph.style.color = '#999999';
    followersCellSubtextParagraph.innerText = 'followers';

    followersCellCountParagraph.appendChild(followersCellBold);
    followersCell.appendChild(followersCellCountParagraph);
    followersCell.appendChild(followersCellSubtextParagraph);

    // Create profile picture <img>
    let profilePicture = document.createElement('img');
    profilePicture.src = userMetadata.metadata.profilePictureUrl;
    profilePicture.className = 'round-full';
    profilePicture.id = 'profile-picture';

    // Create profile picture cell
    let profilePictureCell = profileHeaderTableRow.insertCell(1);
    profilePictureCell.className = 'profile-header-cell';
    profilePictureCell.id = 'profile-picture-cell';
    profilePictureCell.innerHTML = profilePicture.outerHTML;

    // Create following cell
    let followingCell = profileHeaderTableRow.insertCell(2);
    followingCell.className = 'profile-header-cell';
    let followingCellCountParagraph = document.createElement('p');
    followingCellCountParagraph.id = 'following-cell-count-paragraph';

    let followingCellBold = document.createElement('b');
    followingCellBold.innerText = `${userMetadata.metadata.followingCount}`

    let followingCellSubtextParagraph = document.createElement('p');
    followingCellSubtextParagraph.id = 'following-cell-subtext-paragraph';
    followingCellSubtextParagraph.style.color = '#999999';
    followingCellSubtextParagraph.innerText = 'following';

    followingCellCountParagraph.appendChild(followingCellBold);
    followingCell.appendChild(followingCellCountParagraph);
    followingCell.appendChild(followingCellSubtextParagraph);

    // Render the table onto the page by attaching it to the materialize components
    profileHeaderDiv.appendChild(profileHeaderTable);
    profileHeaderColumns.appendChild(profileHeaderDiv);
    profileHeaderRow.appendChild(profileHeaderColumns);
    profileHeaderRow.appendAfter(inputRow);
}

let removeProfileHeader = () => {
    let profileHeaderRow = document.querySelector('#profile-header-row');
    profileHeaderRow.parentNode.removeChild(profileHeaderRow);
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
    let response = null;

    try {
        response = await axios.post('/api/nonfollower', userMetadata);
    }
    catch (error) {
        throw new Error('Yikes! Something goofed, try again.');
    }

    // POST /api/nonfollower will return 200 with error property if handle does not exist
    if ('error' in response.data) {
        throw new Error(response.data.error);
    }

    return response.data;
}

let requestMetadata = async (handle) => {
    let response = null;

    try {
        response = await axios.get('/api/metadata', { params: { username: handle } });
    }
    catch (error) {
        throw new Error('Yikes! Something goofed, try again.');
    }

    if (response.status === 200 && 'error' in response.data) {
        throw new Error(response.data.error);
    }

    return response.data;
}

let renderTutorial = () => {
    let tutorialDiv = document.createElement('div');
    tutorialDiv.className = 'row';
    tutorialDiv.id = 'tutorial-row'

    let tutorialMessage = document.createElement('p')
    tutorialMessage.id = 'tutorial-row-message';
    tutorialMessage.textContent = 'Tutorial: Quickly change your account to public and then hit \'Submit\' again.';
    
    let tutorialGif = document.createElement('img');
    tutorialGif.src = '/img/tutorial.gif';
    tutorialGif.style.width = '308px';
    tutorialGif.style.height = '452px';

    tutorialDiv.appendChild(tutorialMessage);
    tutorialDiv.appendChild(tutorialGif);
    let errorRow = document.querySelector('#error-row');
    tutorialDiv.appendAfter(errorRow);
}

let removeTutorial = () => {
    let tutorialDiv = document.querySelector('#tutorial-row');
    tutorialDiv.parentNode.removeChild(tutorialDiv);
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
        handleRow.id = 'nonfollower-text-cell';
        let handleParagraph = document.createElement('p');
        handleParagraph.id = 'nonfollower-handle';
        handleParagraph.innerText = nonfollower.username;
        let fullNameParagraph = document.createElement('p');
        fullNameParagraph.id = 'nonfollower-fullname';
        fullNameParagraph.innerText = nonfollower.fullName;
        handleRow.appendChild(handleParagraph);
        handleRow.appendChild(fullNameParagraph);

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