import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import URL from '../common/Global';

class ListPacientes extends Component {
    url = URL.API;

    state = {
        pacientes: [],
        status: null
    };

    componentDidMount() {
        this.getPacientes();
    }

    getPacientes = () => {
        axios.get(this.url + '/pacientes').then(res => {
            this.setState({
                pacientes: res.data.patients || [],
                status: 'success'
            });
        }).catch(error => {
            console.error('Error fetching pacientes:', error);
            this.setState({
                status: 'error'
            });
        });
    };

    render() {
        return (
            <div>
                {this.state.status === 'success' && (
                    <table border="1">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Foto del paciente</th>
                                <th>Opciones de administrador</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.pacientes.map(paciente => (
                                <tr key={paciente._id}>
                                    <td>{paciente.nombre}</td>
                                    <td>{paciente.email}</td>
                                    <td>
                                        {paciente.fotoPersonal ? (
                                            <img src={this.url + '/paciente/archivo/' + paciente.fotoPersonal} alt={paciente.nombre} height="100px" width="100px" />
                                        ) : (
                                            <img src="https://www.shutterstock.com/image-vector/avatar-man-icon-profile-placeholder-600nw-1229859850.jpg" alt={paciente.nombre} height="100px" width="100px" />
                                        )}
                                    </td>
                                    <td><Link to={'/paciente/detail/' + paciente._id}>Detalles</Link></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {this.state.pacientes.length === 0 && this.state.status === 'error' && (
                    <div>
                        <h2>No hay pacientes para mostrar</h2>
                    </div>
                )}
                {this.state.status !== 'success' && this.state.status !== 'error' && (
                    <div>
                        <h2>Cargando...</h2>
                    </div>
                )}
            </div>
        );
    }
}

export default ListPacientes;
