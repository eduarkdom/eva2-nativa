import React, {Component} from 'react'
import ListPacientes from './ListPacientes'

class Home extends Component{
    render(){
        return(
            <div>
                <h3>Últimos Pacientes</h3>
                <ListPacientes home="true"></ListPacientes>
            </div>
        )
    }
}

export default Home;