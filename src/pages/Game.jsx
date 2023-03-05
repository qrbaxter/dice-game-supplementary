import { nanoid } from 'nanoid';
import React, { useEffect, useState } from 'react';
import Die from '../Die';

const NUM_DICE = 6;
const THRESHOLD_SCORE = 350;
const DICE_INITIAL = Array(NUM_DICE).fill(null).map(() => ({ id: nanoid(), value: generateRandomDieValue() }));

function Game() {
  const [dice, setDice] = useState(DICE_INITIAL);

  const [bankedScore, setBankedScore] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [diceSet, setDiceSet] = useState(false);
  const [newDiceBtnDisabled, setNewDiceBtnDisabled] = useState(false);
  const [busted, setBusted] = useState(false);
  const [bankerinoBlock, setBankerinoBlock] = useState(false);
  const [endTurnBtnDisabled, setEndTurnBtnDisabled] = useState(true);
  const [bustCount, setBustCount] = useState(0);

  // Keep an array of IDs to keep track of held and banked.
  const [heldDice, setHeldDice] = useState([]);
  const [bankedDice, setBankedDice] = useState([]);

  console.log('Game ➡️ held:', heldDice);

  function holdDice(id) {
    setHeldDice(held => [...held, id]);

    setDice(oldDice =>
      oldDice.map(die => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      }),
    );
  }

  const bankPoints = () => {
    let ones = 0;
    let fives = 0;

    if (!threePairs(dice)) {
      for (let i = 0; i < 6; i++) {
        if (dice[i].isHeld && (dice[i].value === 1 || dice[i].value === 5)) {
          if (dice[i].value === 1) {
            ones++;
          } else {
            fives++;
          }
          dice[i].isHeld = false;
          dice[i].value = 0;
          setCurrentScore(currentScore + ones * 100 + fives * 50);
        } else if (ones === 0 && fives === 0) {
          setBankerinoBlock(true);
          setCurrentScore(0);
          setBusted(true);
        }
      }

    } else if (threePairs(dice)) {
      setCurrentScore(currentScore + 500);
      setDice(oldDice =>
        oldDice.map(die => {
          return { ...die, isHeld: !die.isHeld, value: 0 };
        }),
      );
    }
  };

  const endTurn = () => {
    setBankedScore(currentScore + bankedScore);
    setCurrentScore(0);
    newSet();
  };

  const rollDice = () => {
    let newDice;

    if (currentScore > 0) {
      newDice = dice.map(die => die.value === 0 ? die : { id: die.id, value: generateRandomDieValue(), isHeld: false });
    } else {
      newDice = dice.map(die => {
        return die.value !== 0 ? { ...die, value: Math.floor(Math.random() * 6) + 1 } : { ...die };
      });
    }

    const onesAndFives = newDice.filter(die => die.value === 1 || die.value === 5);
    if (onesAndFives.length === 0) {
      setCurrentScore(0);
      setBusted(true);

    } else {
      setBusted(false);
    }
    setDice(newDice);
  };

  const resetGame = () => {
    setBankedScore(0);
    setCurrentScore(0);
    localStorage.clear();
    setBustCount(0);
    newSet();
  };

  const newSet = () => {
    setNewDiceBtnDisabled(true);
    setBankerinoBlock(false);

    const newDice = [];
    for (let i = 0; i < 6; i++) {
      newDice.push({ id: nanoid(), value: Math.floor(Math.random() * 6) + 1, isHeld: false });
    }

    setDice(newDice);
    setDiceSet(true);
    setBusted(false);
  };

  useEffect(() => {
    if (busted) {
      localStorage.setItem('bankedScore', bankedScore);
      setNewDiceBtnDisabled(false);
      setBankerinoBlock(true);
      setEndTurnBtnDisabled(true);
      setBustCount(bustCount + 1);
    }
  }, [busted]);

  const isRollButtonDisabled = !!busted;
  const isEndTurnButtonDisabled = currentScore < THRESHOLD_SCORE;

  const displayedDice = dice.filter(die => !bankedDice.includes(die.id));

  return (
    <div>
      <div className="topSection">
        <div>
          <p className="bankedText">Score: {bankedScore}</p>
          <p className="bustedText">Busts: {bustCount}</p>
        </div>

        <div>
          {busted ? (
            <h1 className="gameh1">YOU BUSTED!</h1>
          ) : (
            <h1 className="gameh1">BANKED: {currentScore}</h1>
          )}
        </div>

        <div>
          <button className="endTurnBtn" onClick={endTurn} disabled={isEndTurnButtonDisabled}>
            End Turn
          </button>
          <button className="resetBtn" onClick={resetGame}>
            Reset Game
          </button>
        </div>
      </div>

      <div>
        <div className="dice-container">
          {busted
            ? null
            : dice.map(
              die =>
                die.value !== 0 && ( // Add this line to only render dice that haven't been banked
                  <Die
                    key={die.id}
                    id={die.id}
                    value={die.value}
                    isHeld={die.isHeld}
                    holdDice={() => holdDice(die.id)}
                  />
                ),
            )}
        </div>
        <div className="buttons1">
          {diceSet && (
            <button className="rollBtn" onClick={rollDice} disabled={isRollButtonDisabled}>
              Roll Dice
            </button>
          )}
          <button className="newDiceBtn" onClick={newSet} disabled={newDiceBtnDisabled}>
            New Dice
          </button>
          <button className="bankBtn" onClick={bankPoints} disabled={bankerinoBlock}>
            Bank Points
          </button>
        </div>
      </div>
    </div>
  );
}

const generateRandomDieValue = () => Math.ceil(Math.random() * 6);

function threePairs(dice) {
  const encounteredDice = {};

  dice.forEach(die => {
    if (encounteredDice[die]) {
      encounteredDice[die]++;
    } else {
      encounteredDice[die] = 1;
    }
  });

  const hasThreePairs =
    Object.values(encounteredDice).filter(cardinality => cardinality === 2).length === 3;
  return hasThreePairs;
}


export default Game;
