import React from "react"

export default function Instructions() {
  return (
      <div className="inth">
    <h1>The Goal Is To Hit 10,000 Points</h1>
    <p>You roll six dice, and the target numbers are 1 and 5.</p>
    
    <p>A single 1 represents 100 points, and a single 5 represents 50 points. During your turn, you are aiming to get 350 points at minimum. Once you have 350 points, you can ‘bank’ them, and your turn ends.</p>
    
    <h1>How To Get 350</h1>
    
    <p>Here’s the thing about getting 350. You can do it over multiple throws during your turn. However, each throw needs to ‘reserve’ at least 50 points, meaning you need to roll at least one 1 or at least 1 five with each throw.</p>
    
    <p>‘Reserving’ is putting a reserved die to the side, and rolling with the remaining dice. The goal is to keep reserving until you hit 350.</p>
    
    <p>If you hit 350 and still have dice you can roll, you can gamble them to get even more points, but if you don’t roll a one or five, you will ‘bust’ and gain no points for your turn. </p>
    
    <h1> Getting Bonus Points</h1>
    
    <p>1. Three pairs of numbers are worth 500 points, like 2,2,4,4,5,5.</p>
    
    <p>2. An arrangement of 1,2,3,4,5,6 is worth 1000 points.</p>
    
    <p>3. Three dice of any single number are worth that number times 100, except three 1’s, which are worth 1000 points. For example 3,3,3 is worth 300 points. 5,5,5 is worth 500 points.</p>
    
    <p>4. Any instance of another repeated number after a triple, doubles the value each time. For example three 2’s is 200, but four 2’s is 400, five 2’s is 800, and six 2’s is 1600.</p>
    
    <h1>First to 10,000 Points, Wins!</h1>
    
    
    </div>
    
  )
}