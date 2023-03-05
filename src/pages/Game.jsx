import { nanoid } from 'nanoid';
import React, { useState } from 'react';
import Die from '../Die';

const NUM_DICE = 6;
const THRESHOLD_SCORE = 350;



const SPECIAL_VALUES = [{
  value: 1
  , points: 100,
}, { value: 5, points: 50 }];

// Die status can be 'HELD' or 'BANKED' or null.
const generateNewSet = () => Array(NUM_DICE).fill(null).map(() => ({ id: nanoid(), value: generateRandomDieValue(), status: null }));

function Game() {
  const [dice, setDice] = useState(generateNewSet());

  const [bankedScore, setBankedScore] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [diceSet, setDiceSet] = useState(false);
  const [busted, setBusted] = useState(false);
  const [bustCount, setBustCount] = useState(0);

  // Only render dice that are not banked
  const diceToRender = dice.filter(die => die.status !== 'BANKED');
  const diceHeld = dice.filter(die => die.status === 'HELD');

  function holdDice(id) {
    setDice(oldDice =>
      oldDice.map(die => {
        return die.id === id ? { ...die, status: die.status === 'HELD' ? null : 'HELD' } : die;
      }),
    );
  }

  const bankPoints = () => {
    const matchesThreePairs = hasThreePairs(dice);

    if (matchesThreePairs) {
      setCurrentScore(currentScore + 500);
      newSet();
      return;
    }

    const specialPoints = getPointsFromSpecialDice(dice);
    console.log('Game ➡️ specialPoints:', specialPoints);

    if (specialPoints === 0) {
      setBusted(true);
      setBustCount(bustCount + 1);
      setCurrentScore(0);
      return
    }

    setCurrentScore(current => current + specialPoints);
    setDice(prevDice => prevDice.map(die => die.status === 'HELD' ? ({ ...die, status: 'BANKED' }) : die));

  };


  const endTurn = () => {
    setBankedScore(currentScore + bankedScore);
    setCurrentScore(0);
    newSet();
  };

  const rollDice = () => {
    let newDice;

    // Roll the dice that aren't currently held.
    newDice = dice.map((die) => die.status === null ? ({
      ...die, value: generateRandomDieValue()
    }) : die);

    const newDiceRollable = newDice.filter(die => die.status === null);
    const rollPoints = calculatePointsFromDice(newDiceRollable);

    if (rollPoints === 0) {
      setBustCount(bustCount + 1);
      setCurrentScore(0);
      setBusted(true);
      return;
    }

    setDice(newDice);
  };

  const resetGame = () => {
    setBankedScore(0);
    setCurrentScore(0);
    setBustCount(0);
    newSet();
  };

  const newSet = () => {
    setDice(generateNewSet());
    setDiceSet(true);
    setBusted(false);
  };



  console.log('Game ➡️ diceHeld:', diceHeld);

  const isRollButtonDisabled = !!busted;
  const isNewDiceButtonDisabled = !busted;
  const isEndTurnButtonDisabled = currentScore < THRESHOLD_SCORE;
  const isBankButtonDisabled = diceHeld.length === 0 || !!busted;

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
          {!busted && diceToRender.map(
            die =>
            (<Die
              key={die.id}
              id={die.id}
              value={die.value}
              isHeld={die.status === 'HELD'}
              holdDice={() => holdDice(die.id)}
            />)
          )}
        </div>
        <div className="buttons1">
          {diceSet && (
            <button className="rollBtn" onClick={rollDice} disabled={isRollButtonDisabled}>
              Roll Dice
            </button>
          )}
          <button className="newDiceBtn" onClick={newSet} disabled={isNewDiceButtonDisabled}>
            New Dice
          </button>
          <button className="bankBtn" onClick={bankPoints} disabled={isBankButtonDisabled}>
            Bank Points
          </button>
        </div>
      </div>
    </div>
  );
}

const generateRandomDieValue = () => Math.ceil(Math.random() * 6);



function isSixConsecutive(dice) {
  if (dice.length !== NUM_DICE) {
    return
  }

  // Add up all numbers from 1 to NUM_DICE
  const consecutive = Array(NUM_DICE).fill(null).map(i => i + 1);
  const diceSorted = dice.sort((a, b) => a - b);

  const isConsecutive = consecutive.every((item, index) => item === diceSorted[index].value);
  return isConsecutive;
}

function hasThreePairs(dice) {
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

function getPointsFromSpecialDice(dice) {
  let points = 0;

  dice.forEach(die => {
    // If this die is special (1 or 5), assign to our special variable.
    const special = SPECIAL_VALUES.find(special => special.value === die.value);

    if (special) {
      points += special.points;
    }
  });

  return points;
}

function calculatePointsFromDice(dice) {
  // Test all our special conditions first
  if (hasThreePairs(dice)) {
    return 500;
  }

  if (isSixConsecutive(dice)) {
    return 1000;
  }

  // if (isThreeOfSimilar(dice)) {
  //   return ...
  // }

  // if (anotherSpecialCondition(dice)) {
  //   return ...
  // }

  return getPointsFromSpecialDice(dice);

}


export default Game;
