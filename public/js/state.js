class State {
    static update(executor, key, value) {
        try {
            executor();
        }   
        catch (error) {
            console.log('Executor could not run; state was not updated.');
        }

        State.events[key] = value;
    }
}

State.events = {};