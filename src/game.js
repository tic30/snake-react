import React, { Component } from "react"
import "./game.css"

const SNAKE = "s", FOOD = "f", STARTINDEX = 214, ROWS=20, COLS=30, CELLSIZE=30,
      KEYS = { LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 }

class SnakeGame extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()

    this.getInitialState = this.getInitialState.bind(this)
    this.resetGame = this.resetGame.bind(this)
    this.resumeGame = this.resumeGame.bind(this)
    this.placeFood = this.placeFood.bind(this)
    this.timeTick = this.timeTick.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }

  getInitialState() {
    let snake = [],
        board = new Array(ROWS * COLS).fill(null)
    for(let i=0;i<3;i++){
      board[STARTINDEX-i] = SNAKE
      snake[i] = STARTINDEX-i 
    }
    return {
      snake: snake,
      board: board,
      growth: 0,
      paused: true,
      gameOver: false,
      direction: KEYS.RIGHT
    }
  }

  resetGame() {
    this.setState(this.getInitialState(), ()=>{
      this.refs.board.focus()
      this.placeFood()
    })
  }

  componentDidMount(){
    this.resetGame()
  }

  resumeGame() {
    if (this.state.gameOver || !this.state.paused) return
    this.setState({ paused: false }, ()=>{
      this.timeTick()
      this.refs.board.focus()
    })
  }

  placeFood(){
    let { board } = this.state
    let index 
    do {
      index = Math.floor(Math.random() * COLS * ROWS) 
    } while(board[index] === SNAKE)
    board[index] = FOOD
    this.setState({ board: board })
  }

  timeTick() {
    let { board, snake, growth, direction, paused } = this.state
    if (paused) return

    let head = this.getNextHeadPos(snake[0])
    if (snake.indexOf(head) !== -1 || snake[0]/COLS <=0 || snake[0]/COLS >= ROWS - 1 
      || snake[0] % COLS <= 0 || snake[0] % COLS >= COLS - 1) {
      this.setState({ gameOver: true })
      return
    }

    let needsFood = board[head] === FOOD
    if (needsFood || paused) {
      this.placeFood()
      growth += 2
    } else if (growth) {
      growth -= 1
    } else {
      board[snake.pop()] = null
    }

    snake.unshift(head)
    board[head] = SNAKE

    if (this._nextDirection) {
      direction = this._nextDirection
      this._nextDirection = null
    }

    this.setState({
      snake: snake,
      board: board,
      growth: growth,
      direction: direction
    })

    setTimeout(this.timeTick, 80)
  }

  handleKeyPress(e) {
    const {direction, paused} = this.state
    if (Object.values(KEYS).includes(e.keyCode) && paused){
      this.resumeGame()
      return
    }
    let difference = Math.abs(direction - e.keyCode)
    // ignore invalid key
    if (Object.values(KEYS).includes(e.keyCode) && difference !== 0 && difference !== 2) {
      this._nextDirection = e.keyCode
    }
  }

  getNextHeadPos(head) {
    const {direction} = this.state
    let x = head % COLS,
        y = Math.floor(head / COLS)
  
    switch (direction) {
      case KEYS.UP: 
        return (COLS * (y - 1)) + x
      case KEYS.DOWN: 
        return (COLS * (y + 1)) + x
      case KEYS.LEFT: 
        return (COLS * y) + x - 1 
      case KEYS.RIGHT:
        return (COLS * y) + x + 1 
      default: 
        return null
    }
  }

  render() {
    const { board, gameOver, paused } = this.state

    return (
      <div className="game-wrapper">
        <div className="game-title">{gameOver ? "Game Over" : paused ? "Press any Arrow key to start" : "Use Arrow keys to play"}</div>
        <div
          ref="board"
          className={"game-board" + (gameOver ? " game-over" : "")}
          tabIndex={0}
          onKeyDown={this.handleKeyPress}
          style={{ width: COLS * CELLSIZE, height: ROWS * CELLSIZE }}>
          {
						board.map((celltype, index) => {
              return (
                <div className={celltype + "-cell"} key={index}/>
              )
						})
					}
        </div>
        <div className="game-overlap">
          {gameOver ? <button onClick={this.resetGame} className="reset-btn"></button> : null}
        </div>
      </div>
    )
  }
}

export default SnakeGame