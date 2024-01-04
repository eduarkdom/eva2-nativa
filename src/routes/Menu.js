import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Search from '../components/Search';

class Menu extends Component {
    render() {
        var header = "BIENVENIDO AL HOSPITAL EL ALERCE ";
        return (
            <div>
                <h1>{header}</h1>
                <ul>
                    <li><NavLink to="/">Inicio</NavLink></li>
                    <li><NavLink to="/paciente/new">Nuevo paciente</NavLink></li>
                    <li><NavLink to="/paciente/list">Lista de pacientes</NavLink></li>
                </ul>
                <Search></Search>
            </div>
        );
    }
}

export default Menu;
