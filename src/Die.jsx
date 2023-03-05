import React from 'react';

const styles = {
  color: '#30D5C8',
  white: 'yellow',
};

function getDiceSymbol(value, isHeld) {
  const diceSymbols = [
    '\u2680', // Dice symbol for 1
    '\u2681', // Dice symbol for 2
    '\u2682', // Dice symbol for 3
    '\u2683', // Dice symbol for 4
    '\u2684', // Dice symbol for 5
    '\u2685', // Dice symbol for 6
  ];
  return (
    <span style={{ color: isHeld ? styles.color : styles.white }}>{diceSymbols[value - 1]}</span>
  );
}

export default function Die(props) {
  return (
    <div>
      <h2 className="theBigDice" onClick={props.holdDice}>
        {getDiceSymbol(props.value, props.isHeld)}
      </h2>
    </div>
  );
}
