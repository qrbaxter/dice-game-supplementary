import React from "react"
import {Link, Switch, Route} from "react-router-dom"
import Instructions from "./pages/Instructions"
import Game from "./pages/Game"


export default function App() {

    
    return (
        <div>
            <nav>
                <Link className="game" to ="/">Game</Link>
                <Link className ="instructions" to ="/instructions">Instructions</Link>
            </nav>
            <Switch>
                    <Route exact path="/">
                        <Game />
                    </Route>
                    <Route exact path="/instructions">
                        <Instructions />
                    </Route>
            </Switch>
        
       
       </div>
    )
}



