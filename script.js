function App() {

    const [displayTime, setDisplayTime] = React.useState(25 * 60);
    const [breakTime, setBreakTime] = React.useState(5 * 60);
    const [sessionTime, setSessionTime] = React.useState(25 * 60);
    const [timerOn, setTimerOn] = React.useState(false);
    const [onBreak, setOnBreak] = React.useState(false);
    const [breakAudio, setBreakAudio] = React.useState(
        new Audio('./breakTime.wav')
        )

    const playBreakSound = () => {
        breakAudio.currentTime = 0;
        breakAudio.play();
    }

    const formatTime = (time) => {
        let minutes = Math.floor(time/60);
        let seconds = time % 60;
        return (
            [minutes < 10 ? '0' + minutes: minutes] + 
            ':' + 
            [seconds < 10 ? '0' + seconds: seconds]
        );
    };

    const resetTime = () => {
        setDisplayTime(25*60);
        setBreakTime(5*60);
        setSessionTime(25*60);
    }

    const changeTime = (amount, type) => {
        if(type == 'break') {
            if(breakTime <= 60 && amount < 0) {
                return;
            }
            setBreakTime(prev => prev + amount)
        } else {
            if(sessionTime <= 60 && amount < 0) {
                return;
            }
            setSessionTime ((prev) => prev + amount);
            if (!timerOn) {
                setDisplayTime(sessionTime + amount)
            }
        }
    }

    const controlTime = () => {
        let second = 1000;
        let date = new Date().getTime();
        let nextDate = new Date().getTime() + second;
        let onBreakVariable = onBreak;
        if (!timerOn) {
            let interval = setInterval(() => {
                date = new Date().getTime();
                if (date > nextDate) {
                    setDisplayTime(prev => {
                        if (prev <= 0 && !onBreakVariable) {
                            playBreakSound();
                            onBreakVariable = true;
                            setOnBreak(true);
                            return breakTime;
                        } else if (prev <= 0 && onBreakVariable) {
                            playBreakSound();
                            onBreakVariable = false;
                            setOnBreak(false);
                            return sessionTime;
                        }
                        return prev - 1;
                    });
                    nextDate += second;
                }
            }, 30)
            localStorage.clear();
            localStorage.setItem('interval-id', interval);
        }
        if (timerOn) {
            clearInterval(localStorage.getItem('interval-id'))
        }
        setTimerOn(!timerOn)
    }

    return (
        <div class="text-center text-light">
            <h1>Pomodoro Clock</h1>
            <br></br>
            <div class="length-box">
                <h3 id="break-label">Break Length</h3>
                <div class="value-display">
                    {breakTime / 60} min/s
                </div>
                <div id="break-buttons">
                    <button id="break-decrement" 
                            class="btn btn-outline-light"
                            onClick={() => changeTime(-60, "break")}>
                        <i class="bi bi-arrow-down"></i> 
                    </button>
                    <button id="break-increment" 
                            class="btn btn-outline-light"
                            onClick={() => changeTime(60, "break")}>
                        <i class="bi bi-arrow-up"></i>
                    </button>
                </div>
            </div>
            <br></br>
            <div class="length-box">
                <h3 id="session-label">Session Length</h3>
                <div class="value-display">
                    {sessionTime / 60} min/s
                </div>
                <div id="session-buttons">
                    <button id="session-decrement" 
                            class="btn btn-outline-light"
                            onClick={() => changeTime(-60, "session")}>
                        <i class="bi bi-arrow-down"></i> 
                    </button>
                    <button id="session-increment" 
                            class="btn btn-outline-light"
                            onClick={() => changeTime(60, "session")}>
                        <i class="bi bi-arrow-up"></i>
                    </button>
                </div>
            </div> 
            <br></br>
            <div>
                <h3 id="timer-label">{onBreak ? "Break" : "Session"}</h3>
            </div> 
            <div id="time-left">
                <h4>{formatTime(displayTime)}</h4>
            </div>
            <div id="timer-buttons">
                <button id="start_stop"
                        class="btn btn-outline-light btn-lg col-2" 
                        onClick={controlTime}>
                    {timerOn ? [
                        <i class="bi bi-pause-fill"></i>
                    ]: [
                        <i class="bi bi-play-fill"></i>
                    ]}
                </button>
                <button id="reset"
                        class="btn btn-outline-light btn-lg col-2" 
                        onClick={resetTime}>
                    <i class="bi bi-arrow-counterclockwise"></i>
            </button>
            </div>    
        </div>
    )
}

ReactDOM.render(<App/>, document.getElementById("root"));