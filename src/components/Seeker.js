import React, { Component } from 'react';
import Search from '../components/Search';
import ListPacientes from './ListPacientes';

class Seeker extends Component {
    render() {
        var field = this.props.match.params.search;
        return (
            <div>
                <h1>Searching: {field}</h1>
                <ListPacientes search={field}></ListPacientes>
                <Search></Search>
            </div>
        );
    }
}

export default Seeker;
