import { Component, ChangeEvent, MouseEvent } from 'react';
import ReactHowler from 'react-howler';

interface FullControlState {
    playing: boolean;
    loaded: boolean;
    loop: boolean;
    mute: boolean;
    volume: number;
    seek: number;
    rate: number;
    isSeeking: boolean;
    duration?: number;
}

class FullControl extends Component<unknown, FullControlState> {
    private player: ReactHowler | null = null;
    private _raf?: number;

    constructor(props: unknown) {
        super(props);

        this.state = {
            playing: false,
            loaded: false,
            loop: false,
            mute: false,
            volume: 1.0,
            seek: 0.0,
            rate: 1,
            isSeeking: false
        };

        this.handleToggle = this.handleToggle.bind(this);
        this.handleOnLoad = this.handleOnLoad.bind(this);
        this.handleOnEnd = this.handleOnEnd.bind(this);
        this.handleOnPlay = this.handleOnPlay.bind(this);
        this.handleStop = this.handleStop.bind(this);
        this.renderSeekPos = this.renderSeekPos.bind(this);
        this.handleLoopToggle = this.handleLoopToggle.bind(this);
        this.handleMuteToggle = this.handleMuteToggle.bind(this);
        this.handleMouseDownSeek = this.handleMouseDownSeek.bind(this);
        this.handleMouseUpSeek = this.handleMouseUpSeek.bind(this);
        this.handleSeekingChange = this.handleSeekingChange.bind(this);
    }

    componentWillUnmount() {
        this.clearRAF();
    }

    handleToggle() {
        this.setState((prevState) => ({
            playing: !prevState.playing
        }));
    }

    handleOnLoad() {
        this.setState({
            loaded: true,
            duration: this.player?.duration() ?? 0
        });
    }

    handleOnPlay() {
        this.setState({
            playing: true
        });
        this.renderSeekPos();
    }

    handleOnEnd() {
        this.setState({
            playing: false
        });
        this.clearRAF();
    }

    handleStop() {
        this.player?.stop();
        this.setState({
            playing: false
        });
        this.renderSeekPos();
    }

    handleLoopToggle() {
        this.setState((prevState) => ({
            loop: !prevState.loop
        }));
    }

    handleMuteToggle() {
        this.setState((prevState) => ({
            mute: !prevState.mute
        }));
    }

    handleMouseDownSeek() {
        this.setState({
            isSeeking: true
        });
    }

    handleMouseUpSeek(e: MouseEvent<HTMLInputElement>) {
        this.setState({
            isSeeking: false
        });

        const target = e.target as HTMLInputElement;
        this.player?.seek(parseFloat(target.value));
    }

    handleSeekingChange(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            seek: parseFloat(e.target.value)
        });
    }

    renderSeekPos() {
        if (!this.state.isSeeking && this.player) {
            this.setState({
                seek: this.player.seek() ?? 0
            });
        }
        if (this.state.playing) {
            this._raf = requestAnimationFrame(this.renderSeekPos);
        }
    }

    clearRAF() {
        if (this._raf) {
            cancelAnimationFrame(this._raf);
        }
    }

    render() {
        return (
            <div className='mb-4 w-full h-[96px] p-4 flex flex-wrap items-center justify-between bg-surface rounded-[30px]'>
                <ReactHowler
                    src={`https://api.smashup.ru/uploads/mashup/1.mp3`}
                    playing={this.state.playing}
                    onLoad={this.handleOnLoad}
                    onPlay={this.handleOnPlay}
                    onEnd={this.handleOnEnd}
                    loop={this.state.loop}
                    mute={this.state.mute}
                    volume={this.state.volume}
                    ref={(ref) => (this.player = ref)}
                />

                <p>{this.state.loaded ? 'Loaded' : 'Loading'}</p>

                <div className='toggles'>
                    <label>
                        Loop:
                        <input
                            type='checkbox'
                            checked={this.state.loop}
                            onChange={this.handleLoopToggle}
                        />
                    </label>
                    <label>
                        Mute:
                        <input
                            type='checkbox'
                            checked={this.state.mute}
                            onChange={this.handleMuteToggle}
                        />
                    </label>
                </div>

                <p>
                    Status: {this.state.seek.toFixed(2)} /{' '}
                    {this.state.duration ? this.state.duration.toFixed(2) : 'NaN'}
                </p>

                <div className='volume'>
                    <label>
                        Volume:
                        <span className='slider-container'>
                            <input
                                type='range'
                                min='0'
                                max='1'
                                step='0.05'
                                value={this.state.volume}
                                onChange={(e) =>
                                    this.setState({ volume: parseFloat(e.target.value) })
                                }
                            />
                        </span>
                        {this.state.volume.toFixed(2)}
                    </label>
                </div>

                <div className='seek'>
                    <label>
                        Seek:
                        <span className='slider-container'>
                            <input
                                type='range'
                                min='0'
                                max={this.state.duration ? this.state.duration.toFixed(2) : '0'}
                                step='0.01'
                                value={this.state.seek}
                                onChange={this.handleSeekingChange}
                                onMouseDown={this.handleMouseDownSeek}
                                onMouseUp={this.handleMouseUpSeek}
                            />
                        </span>
                    </label>
                </div>

                <button onClick={this.handleToggle}>{this.state.playing ? 'Pause' : 'Play'}</button>
                <button onClick={this.handleStop}>Stop</button>
            </div>
        );
    }
}

export default FullControl;
