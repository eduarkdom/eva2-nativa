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
                pacientes: res.data.pacientes,
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
        if (this.state.pacientes.length >= 1) {
            return (
                <table border="1">
                    <thead>
                        <tr>
                            <td>Nombre</td>
                            <td>Email</td>
                            <td>Foto del paciente</td>
                            <td>Opciones de administrador</td>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.pacientes.map(paciente => (
                            <tr key={paciente._id}>
                                <td>{paciente.nombre}</td> {/* Cambia "fullname" por "nombre" */}
                                <td>{paciente.email}</td> {/* Si tienes un campo de email, asegúrate de pasarlo desde el backend */}
                                <td>
                                    {paciente.fotoPersonal ? (
                                        <img src={this.url + '/paciente/archivo/' + paciente.fotoPersonal} alt={paciente.nombre} height="100px" width="100px" />
                                    ) : (
                                        <img src="https://www.rockombia.com/images/upload/rockombia-201504171429313975.jpg" alt={paciente.nombre} height="100px" width="100px" />
                                    )}
                                </td>
                                <td><Link to={'/paciente/detail/' + paciente._id}>Detalles</Link></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        } else if (this.state.pacientes.length === 0 && this.state.status === 'success') {
            return (
                <div>
                    <h2>No hay pacientes para mostrar</h2>
                </div>
            );
        } else {
            return (
                <div>
                    <h2>Cargando...</h2>
                </div>
            );
        }
    }
}

export default ListPacientes;
