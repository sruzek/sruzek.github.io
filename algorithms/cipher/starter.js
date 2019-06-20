const R = R
const React = React
const ReactDOM = ReactDOM
const Immutable = Immutable
const domContainerNode = document.getElementById('react-app')

const Redux = Redux
const {Provider} = ReactRedux
const thunkMiddleware = ReduxThunk.default
const {connectStateValue, connectValue, createActionConnector} = ReactReduxConnectHelpers

/* Encryption Helpers */
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('')

const letterIndexes = ALPHABET.reduce((acc, letter, i) => {
  acc[letter] = i
  return acc
}, {})

const isUpperCase = str => R.equals(str, R.toUpper(str))

const normalizeShift = shift =>
  shift < 0
  ? 26 - (-shift % 26)
  : shift % 26

const makeEncoder = shift => ALPHABET.reduce((acc, letter) => {
  const letterIndex = letterIndexes[letter]
  const encryptedLetter = ALPHABET[(letterIndex + shift) % ALPHABET.length]
  acc[letter] = encryptedLetter
  return acc
}, {})

const encryptMessage = (shift = 0, message = '') => {
  const encoder = R.compose(makeEncoder, normalizeShift)(shift)
  const encryptedMessage = message
    .split('')
    .map(char => {
      const key = R.toLower(char)
      if (encoder[key]) {
        return isUpperCase(char)
          ? R.toUpper(encoder[key]) : encoder[key]
      }
      return char
    })
    .join('')

  return encryptedMessage
}

const decryptMessage = (shift = 0, message) => {
  const inverseShift = ALPHABET.length - shift
  return encryptMessage(inverseShift, message)
}

/* Redux */
const initialState = Immutable.fromJS({
  shift: 1,
  message: '', // 'Attack at dawn!',
  encrypted: '', // 'Buubdl bu ebxo!',
  highlighted: null
})

const actionTypes = {
  CHANGE_SHIFT: 'CHANGE_SHIFT',
  CHANGE_MESSAGE: 'CHANGE_MESSAGE',
  CHANGE_ENCRYPTED: 'CHANGE_ENCRYPTED',
  CHANGE_HIGHLIGHTED: 'CHANGE_HIGHLIGHED'
}

const actionCreators = {
  changeShift: shift => ({
    type: actionTypes.CHANGE_SHIFT,
    payload: shift
  }),
  changeMessage: message => ({
    type: actionTypes.CHANGE_MESSAGE,
    payload: message
  }),
  changeEncrypted: message => ({
    type: actionTypes.CHANGE_ENCRYPTED,
    payload: message
  }),
  changeHighlighted: letter => ({
    type: actionTypes.CHANGE_HIGHLIGHTED,
    payload: letter
  })
}

const rootReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case actionTypes.CHANGE_SHIFT:
      return state
        .set('shift', payload)
        .set('encrypted', encryptMessage(payload, state.get('message')))
    case actionTypes.CHANGE_MESSAGE:
      return state
        .set('message', payload)
        .set('encrypted', encryptMessage(state.get('shift'), payload))
    case actionTypes.CHANGE_ENCRYPTED:
      return state
        .set('encrypted', payload)
        .set('message', decryptMessage(state.get('shift'), payload))
    case actionTypes.CHANGE_HIGHLIGHTED:
      return state
        .set('highlighted', payload)
    default :
      return state
  }
}

const thunk = thunkMiddleware
const logger = window.reduxLogger({
  collapsed: true,
  stateTransformer: state => state.toJS(),
  diff: true
})
const middleware = Redux.applyMiddleware(thunk, logger)

const store = Redux.createStore(rootReducer, initialState, middleware)
const connectAction = createActionConnector(actionCreators)

const TextWheel = props => {
  const {id, shift, text, textColor, border, showBorder, diameter, onSpokeHover} = props
  const chars = props.text.split('')

  const spokeWidth = diameter / chars.length
  const spokeHeight = diameter / 2
  const spokeLeft = diameter / 2 - spokeWidth / 2
  const spokeAngle = 360 / chars.length

  return <div
    id={props.id}
    className='wheel'
    style={{
      width: `${diameter}px`,
      height: `${diameter}px`,
      border: border,
      borderStyle: showBorder ? 'solid' : 'hidden',
      borderRadius: '50%',
      position: 'relative',
      transform: `rotate(${-shift * spokeAngle}deg)`,
      transition: '.3s ease'
    }}
  >
    { chars.map((char, i) =>
      <div
        key={i}
        className='spoke'
        // onHover={onSpokeHover}
        style={{
          width: `${spokeWidth}px`,
          height: `${spokeHeight}px`,
          textAlign: 'center',
          position: 'absolute',
          left: `${spokeLeft}px`,
          display: 'inline-block',
          transform: `rotate(${i * spokeAngle}deg)`,
          transformOrigin: 'bottom center',
          fontFamily: 'inherit'
        }}
      >{char}</div>)
    }
  </div>
}

TextWheel.defaultProps = {
  shift: 0,
  text: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  textColor: 'black',
  border: '5px solid #3BB0FF',
  showBorder: true,
  diameter: 260,
  onSpokeHover: n => n
}

TextWheel.propTypes = {
  shift: React.PropTypes.number,
  text: React.PropTypes.string,
  textColor: React.PropTypes.string,
  border: React.PropTypes.string,
  showBorder: React.PropTypes.bool,
  diameter: React.PropTypes.number,
  onSpokeHover: React.PropTypes.func
}

const ShiftDisplay = ({shift}) =>
  <h2>{normalizeShift(shift)}</h2>

const ShiftButtonDisplay = ({changeShift, shift, direction}) =>
  <button className='shift-button' onClick={()=> {
    changeShift(shift + direction)
  }}>{direction > 0 ? '→' : '←'}</button>

class Textarea extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.toggleFocus = this.toggleFocus.bind(this)
    this.handleScroll = this.handleScroll.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.state = {
      isFocused: false,
      message: props.children || props.value
    }
  }

  static propTypes = {
    onChange: React.PropTypes.func
  };

  static defaultProps = {
    width: '12em',
    height: '6em',
    padding: '5px',
    disabled: false,
    spellcheck: false,
    onChange: () => null
  };

  toggleFocus () {
    this.setState({isFocused: !this.state.isFocused})
  }

  handleScroll (e) {
    this._textarea.scrollTop = e.target.scrollTop
  }

  handleChange (e) {
    const message = e.target.value
    this.setState({message}, () => this.props.onChange(message))
  }

  componentWillReceiveProps (nextProps) {
    if (this.state.message !== nextProps.value) {
      this.setState({message: nextProps.value})
    }
  }

  render () {
    const size = `calc(100% - ${parseInt(this.props.padding) * 2}px`

    return <div
      style={{border: '5px solid #1C2025', borderRadius: '.3em', position: 'relative', width: this.props.width, height: this.props.height, margin: '0 auto', top: 0, left: 0, whiteSpace: 'inherit-wrap', wordWrap: 'break-word'}}
    >
      <div
        ref={_textarea => { this._textarea = _textarea }}
        style={{pointerEvents: 'none', position: 'absolute', padding: this.props.padding, textAlign: 'left', whiteSpace: 'pre-wrap', width: size, height: size, overflowY: 'scroll'}}
      >
        { this.state.message && this.state.message.length
          ? this.state.message
              .split(this.props.highlightSelection)
              .reduce((acc, curr, i, arr) => {
                acc.push(curr)
                if (i < arr.length - 1) {
                  acc.push(
                    <span
                      key={i}
                      style={this.props.highlightStyle}
                    >{this.props.highlightSelection}</span>
                  )
                }
                return acc
               }, [])
          : <span style={{opacity: 0.5}}>{this.state.isFocused ? '' : this.props.placeholder}</span>
        }
      </div>
      <textarea
        style={{width: size, height: size, padding: this.props.padding, margin: 0, background: 'rgba(0, 0, 0, 0)', outline: 'none', resize: 'none', positon: 'absolute', right: this.props.padding, fontSize: '1em', fontFamily: 'inherit', WebkitTextFillColor: 'transparent', textShadow: '0px 0px 0px rgba(0, 0, 0, 0)', lineHeight: 'inherit', border: 'none'}}
        value={this.state.message}
        onBlur={this.toggleFocus}
        onFocus={this.toggleFocus}
        onChange={this.handleChange}
        onScroll={this.handleScroll}
        disabled={this.props.disabled}
        spellCheck={this.props.spellcheck}
      />
    </div>

  }
}

const OuterWheel = R.compose(
  connectValue('outer-wheel', 'id'),
  connectValue(false, 'showBorder'),
  // connectAction('changeHighlighted', 'onSpokeHover')
)(TextWheel)

const InnerWheel = R.compose(
  connectValue('inner-wheel', 'id'),
  connectValue(200, 'diameter'),
  connectStateValue('shift')
)(TextWheel)

const Shift = R.compose(
  connectStateValue('shift')
)(ShiftDisplay)

const ShiftLeftButton = R.compose(
  connectValue(-1, 'direction'),
  connectStateValue('shift'),
  connectAction('changeShift')
)(ShiftButtonDisplay)

const ShiftRightButton = R.compose(
  connectValue(1, 'direction'),
  connectStateValue('shift'),
  connectAction('changeShift')
)(ShiftButtonDisplay)

const Message = R.compose(
  connectValue('Write your message', 'placeholder'),
  connectStateValue('message', 'value'),
  connectAction('changeMessage', 'onChange')
)(Textarea)

const Encrypted = R.compose(
  connectValue('Encrypted message', 'placeholder'),
  connectStateValue('encrypted', 'value'),
  connectAction('changeEncrypted', 'onChange')
)(Textarea)

const MainDisplay = props =>
  <main>
    <h1>Caesar Cipher</h1>
    <div className='wheels'>
      <div className='absolute-centered'><OuterWheel /></div>
      <div className='absolute-centered'><InnerWheel /></div>
      <div className='absolute-centered'><Shift /></div>
    </div>
  <div className='controls'>
    <ShiftLeftButton />
    <ShiftRightButton />
  </div>
  <div className='text-entry'>
    <h3>Plaintext:</h3>
    <Message />
  </div>
  <div className='text-entry'>
    <h3>Encrypted:</h3>
    <Encrypted />
  </div>
</main>

const App = props =>
  <Provider store={store}>
    <MainDisplay />
  </Provider>

ReactDOM.render(<App /> , domContainerNode)
