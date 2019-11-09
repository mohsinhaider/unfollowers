class State {
    static get(key) {
        return State.events[key];
    } 

    static update(key, value, executor=(() => { return; })) {
        try {
            if (this.shouldExecute(key, value)) {
                executor();
                State.events[key] = value;
            }
        }   
        catch (error) {
            // Premature remove operations will throw here
        }
    }

    static shouldExecute(key, value) {
        let keyExists = (key in State.events);
        if ((keyExists && State.events[key] === value)) {
            return false;
        }
        return true;
    }
}

State.events = {};
State.states = {
    IS_ERROR_FLASH_ON: 'isErrorFlashOn',
    IS_LOADING_ANIMATION_ON: 'isLoadingAnimationOn',
    IS_LOADING_ANIMATION_2_ON: 'isLoadingAnimation2On',
    IS_NONFOLLOWER_TABLE_ON: 'isNonfollowerTableOn',
    IS_PROFILE_HEADER_ON: 'isProfileHeaderOn',
    IS_SUBMIT_BUTTON_DISABLED: 'isSubmitButtonDisabled',
    CURRENT_HANDLE: 'currentHandle'
}