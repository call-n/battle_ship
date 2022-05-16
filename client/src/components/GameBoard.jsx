import React from 'react'

function GameBoard({ board }) {
    const gameboard = [
        [1,2,3,4,5,6,7,8,9,10],
        [1,2,3,4,5,6,7,8,9,10],
        [1,2,3,4,5,6,7,8,9,10],
        [1,2,3,4,5,6,7,8,9,10],
        [1,2,3,4,5,6,7,8,9,10],
        [1,2,3,4,5,6,7,8,9,10],
        [1,2,3,4,5,6,7,8,9,10],
        [1,2,3,4,5,6,7,8,9,10],
        [1,2,3,4,5,6,7,8,9,10],
        [1,2,3,4,5,6,7,8,9,10],
    ]

    // this is for the friendly board, this should not have anything to interact with
    // only updates when fired on by enemy
    if (board === 'friendly') {
        return (
            <div className="game-board-holder">
                <h5>GameBoard</h5>
                {gameboard.map((y, index) => 
                <div key={index} className="row" data-y={index + 1}>{
                    y.map(x => 
                        <div 
                            key={x} 
                            className="col cols4gameboard" 
                            data-x={x}
                            >
                            {x}
                        </div>)
                    }
                </div>
                )}
            </div>
          )
    }

  return (
    <div className="game-board-holder">
        <h5>GameBoard</h5>
        {gameboard.map((y, index) => 
        <div key={index} className="row" data-y={index + 1}>{
            y.map(x => 
                <div 
                    key={x} 
                    className="col cols4gameboard" 
                    data-x={x}
                    onClick={() => {
                        console.log(index + 1, x)
                    }}
                    >
                    {x}
                </div>)
            }
        </div>
        )}
    </div>
  )
}

export default GameBoard