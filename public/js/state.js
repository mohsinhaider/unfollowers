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