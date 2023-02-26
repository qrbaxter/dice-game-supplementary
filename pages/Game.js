import React, { useState, useEffect } from 'react';
import Die from '../Die';
import { nanoid } from 'nanoid';

function Game() {
    
useEffect(()=>{
    setButtonsDisabled(false)
    return () => {
            setButtonsDisabled(true)
        }
}, [])
    

  const [dice, setDice] = useState([
    { id: nanoid(), value: 0, isHeld: false },
    { id: nanoid(), value: 0, isHeld: false },
    { id: nanoid(), value: 0, isHeld: false },
    { id: nanoid(), value: 0, isHeld: false },
    { id: nanoid(), value: 0, isHeld: false },
    { id: nanoid(), value: 0, isHeld: false },
  ]);

  const [bankedScore, setBankedScore] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [diceSet, setDiceSet] = useState(false);
  const [buttonsActive, setButtonsActive] = useState(true);
  const [buttonsDisabled, setButtonsDisabled] = useState(true);
  const [busted, setBusted] = useState(false);

  function holdDice(id) {
    setDice(oldDice => oldDice.map(die => {
      return die.id === id ?
        {...die, isHeld: !die.isHeld} :
        die
    }))
  }
    
    function buttonDisable(){
        if (buttonsDisabled){
            
        }
    }
  const bankPoints = () => {
  let ones = 0;
  let fives = 0;
  let newDice = [...dice];
  for (let i = 0; i < 6; i++) {
    if (newDice[i].isHeld && (newDice[i].value === 1 || newDice[i].value === 5)) {
      if (newDice[i].value === 1) {
        ones++;
      } else {
        fives++;
      }
      newDice[i].isHeld = false;
      newDice[i].value = 0; // Add this line to remove 1's and 5's from UI
    }
  }
  setDice(newDice);
  setBankedScore(parseInt(bankedScore) + ones * 50 + fives * 100);
  setCurrentScore(parseInt(currentScore) + ones * 50 + fives * 100)
  if (ones === 0 && fives === 0) {
    setTimeout(() => {
      setBusted(true);
      setButtonsDisabled(true)
      setCurrentScore(0)
    }, 300);
  } else {
    setBusted(false);
  }
};
    
    const rollDice = () => {
  let newDice;
  if (bankedScore > 0) {
    newDice = dice.map((die) => {
      return !die.isHeld && die.value !== 0
        ? { ...die, value: Math.floor(Math.random() * 6) + 1 }
        : { ...die };
    });
  } else {
    newDice = dice.map((die) => {
      return !die.isHeld
        ? { ...die, value: Math.floor(Math.random() * 6) + 1 }
        : { ...die };
    });
  }
  const onesAndFives = newDice.filter((die) => die.value === 1 || die.value === 5);
  if (onesAndFives.length === 0) {
    setTimeout(() => {
      setBusted(true);
      setButtonsDisabled(true)
      setCurrentScore(0)
      return <div>
      <h1 className="gameh1">YOU BUSTED!</h1>
      </div>
    }, 300);
  } else {
    setBusted(false);
  }
  setDice(newDice);
};
  const newSet = () => {
    setButtonsDisabled(false)
  setButtonsActive(false);
  const newDice = [];
    for (let i = 0; i < 6; i++) {
      newDice.push({ id: nanoid(), value: Math.floor(Math.random() * 6) + 1, isHeld: false });
    }
    setDice(newDice)
    setDiceSet(true)
    setBusted(false);
  };

  useEffect(() => {
    if (busted) {
      localStorage.setItem('bankedScore', bankedScore);
    }
  }, [busted]);

  return (
    <div>
    <div className = "theScore">
    <p>Banked: {bankedScore}</p>
    </div>
      {busted ?
        <>
          <h1 className="gameh1">YOU BUSTED!</h1>
        </> :
        <>
          <h1 className="gameh1">SCORE: {currentScore}</h1>
        </>
      }
      <div className="dice-container">
        {busted ? null :
          dice.map((die) => (
            die.value !== 0 && // Add this line to only render dice that haven't been banked
            <Die
              key={die.id}
              id={die.id}
              value={die.value}
              isHeld={die.isHeld}
              holdDice={() => holdDice(die.id)}
            />
          ))}
      </div>
      <div className="buttons1">
  {diceSet && (
    <button className="rollBtn" onClick={rollDice} disabled={buttonsDisabled}
    activation={buttonsActive}>
      Roll Dice
    </button>
  )}
  <button className="newDiceBtn" onClick={newSet} disabled={buttonsDisabled} activation={buttonsActive}>
    New Dice
  </button>
  <button className="bankBtn" onClick={bankPoints}>
    Bank Points
  </button>
</div>
      </div>
  );
}

export default Game;
