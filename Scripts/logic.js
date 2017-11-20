var origBoard;
const huPlayer ='O';
const cpuPlayer ='X';

const winCombo = [
                    [0,1,2],
                    [3,4,5],
                    [6,7,8],
                    [0,3,6],
                    [1,4,7],
                    [2,5,8],
                    [0,4,8],
                    [2,4,6]
                  ]

const cells = document.querySelectorAll('.cell');

function selectSym(sym){
  huPlayer = sym;
  cpuPlayer = sym==='O' ? 'X' :'O';
  origBoard = Array.from(Array(9).keys());
  for (let i = 0; i < cells.length; i++) {
    cells[i].addEventListener('click', turnClick, false);
  }
  if (cpuPlayer === 'X') {
    turn(bestSpot(),cpuPlayer);
  }
  document.querySelector('.selectSym').style.display = "none";
}

startGame();


function  startGame ()
          {
            document.querySelector('.winner').style.display = 'none';
            origBoard = Array.from(Array(9).keys())
            //console.log(origBoard)
            for(var i=0; i < cells.length; i++)
                {
                        cells[i].innerText='';
                        cells[i].style.removeProperty('background-color');
                        cells[i].addEventListener('click', turnClick, false);
                }
          }

function turnClick(square)
          {
            //console.log(square.target.id)
            if(typeof origBoard[square.target.id] == 'number')
              {
                turn(square.target.id, huPlayer)
                    if(!checkWin(origBoard, huPlayer) && checkTie()) turn(bestSpot(),cpuPlayer);
              }
          }


function turn(squareId , player )
          {
            origBoard[squareId] = player;
            document.getElementById(squareId).innerText = player;
            let gameWon = checkWin(origBoard, player)
            if(gameWon) gameOver(gameWon)
          }


function checkWin(board, player)
          {
            let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
            let gameWon = null;
            for (let [index, win] of winCombo.entries())
                {
                  if (win.every(elem => plays.indexOf(elem) > -1))
                      {
                        gameWon = {index: index, player: player};
                        break;
                      }
                }
                return gameWon;
          }


function gameOver(gameWon)
          {
            for(let index of winCombo[gameWon.index])
                {
                  document.getElementById(index).style.backgroundColor =
                  gameWon.player == huPlayer? 'blue':'red';
                }
            for(var i=0; i<cells.length; i++)
                {
                  cells[i].removeEventListener('click', turnClick, false);
                }
                declareWinner(gameWon.player == huPlayer ? 'You Win!' : 'You lose:(');
          }

function declareWinner(who)
         {
            document.querySelector('.winner').style.display = 'block';
            document.querySelector('.winner .text').innerText = who;
         }

function emptySquares()
         {
           return origBoard.filter(s => typeof s == 'number')
         }

/*function bestSpot()
          {
            return emptySquares()[0];
          }
*/

function bestSpot()
         {
           return minimax(origBoard, cpuPlayer).index;
         }

function checkTie()
         {
           if(emptySquares().length == 0 )
              {
                for(var i =0; i < cells.length; i++)
                   {
                     cells[i].style.backgroundColor = 'green';
                     cells[i].removeEventListener('click', turnClick, false)
                   }
                   declareWinner('Tie Game!')
                   return true;
              }
                return false;
         }


function minimax(newBoard, player)
         {
           var availSpots = emptySquares(newBoard);

           if(checkWin(newBoard,huPlayer))
              {
                return {score: -10};
              }
              else if(checkWin(newBoard, cpuPlayer))
                     {
                        return {score: 10};
                     }
              else if(availSpots.length === 0 )
                     {
                       return{score: 0};
                     }
              var moves = [];
              for(var i = 0; i < availSpots.length; i++)
                 {
                   var move = {};
                    move.index = newBoard[availSpots[i]];
                    newBoard[availSpots[i]] = player;

                    if(player == cpuPlayer)
                       {
                         var result = minimax(newBoard, huPlayer);
                         move.score = result.score;
                       }
                    else
                       {
                         var result = minimax(newBoard, cpuPlayer);
                         move.score = result.score;
                       }

                    newBoard[availSpots[i]] = move.index;

                    moves.push(move);
                 }

                 var bestMove;
                 if(player === cpuPlayer)
                   {
                     var bestScore = -100000;
                     for(var i = 0; i < moves.length; i++)
                         {
                           if(moves[i].score > bestScore)
                              {
                                bestScore = moves[i].score;
                                bestMove = i;
                              }
                         }
                   }
                    else
                       {
                         var bestScore = 100000;
                         for(var i = 0; i < moves.length; i++)
                             {
                               if(moves[i].score < bestScore)
                                  {
                                    bestScore = moves[i].score;
                                    bestMove = i;
                                  }
                             }

                       }
                       return moves[bestMove];

         }
