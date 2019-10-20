class State {
    static update(key, value, executor) {
        try {
            if (this.shouldExecute(key, value)) {
                executor();
                State.events[key] = value;
            }
        }   
        catch (error) {
            console.log('Executor could not run; state was not updated.');
        }
    }

    static shouldExecute(key, value) {
        let keyExists = (key in State.events);
        if ((!keyExists && !value) || (keyExists && State.events[key] === value)) {
            return false;
        }
        return true;
    }
}

State.events = {};