import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import URL from '../common/Global';

class DetailPaciente extends Component {
    url = URL.API;

    state = {
        paciente: {},
        status: null,
        force: false
    };

    componentDidMount() {
        this.getPacienteById();
    }

    getPacienteById = () => {
        const id = this.props.match.params.id;
        axios.get(`${this.url}/paciente/id/${id}`)
            .then(res => {
                this.setState({
                    paciente: res.data.patient,
                    status: 'success'
                });
            })
            .catch(err => {
                this.setState({
                    paciente: null,
                    status: 'success'
                });
            });
    };

    deletePacienteById = (id) => {
        axios.delete(`${this.url}/paciente/${id}`)
            .then(res => {
                if (res.data.status === 'success Paciente Eliminado') {
                    this.setState({
                        status: 'deleted',
                        force: true
                    });
                    window.alert('Paciente Eliminado');
                }else {
                    this.setState({
                        status: 'error'
                    })
                }
            })
            .catch(err => {
                console.error('Error deleting paciente:', err);
            });
    };
    

    render() {
        if (this.state.force) {
            return <Redirect to="/" />;
        }

        return (
            <div>
                {this.state.paciente && (
                    <div>
                         <table border="1px">
                            <tbody>
                                <tr>
                                    <td>RUT</td>
                                    <td>{this.state.paciente.rut}</td>
                                </tr>
                                <tr>
                                    <td>Nombre Paciente</td>
                                    <td>{this.state.paciente.nombre}</td>
                                </tr>
                                <tr>
                                    <td>Edad</td>
                                    <td>{this.state.paciente.edad}</td>
                                </tr>
                                <tr>
                                    <td>Sexo</td>
                                    <td>{this.state.paciente.sexo}</td>
                                </tr>
                                <tr>
                                    <td>Enfermedad</td>
                                    <td>{this.state.paciente.enfermedad}</td>
                                </tr>
                                <tr>
                                    <td>Fecha de Creación</td>
                                    <td>{this.state.paciente.fechaIngreso}</td>
                                </tr>
                                <tr>
                                    <td>Imagen</td>
                                    <td>
                                        {this.state.paciente.fotoPersonal ? (
                                            <img
                                                src={`${this.url}/paciente/archivo/${this.state.paciente.fotoPersonal}`}
                                                alt={this.state.paciente.fotoPersonal}
                                                width="275px"
                                                height="250px"
                                            />
                                        ) : (
                                            <img
                                                src="https://pbs.twimg.com/media/ERfnjPtWoAYbAad.jpg"
                                                alt=""
                                            />
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                <td>
                                        <Link to={`/paciente/update/${this.state.paciente._id}`}>
                                            Actualizar
                                        </Link>
                                    </td>
                                    <td>
                                        <button onClick={() => this.deletePacienteById(this.state.paciente._id)}>
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
                {!this.state.paciente && this.state.status === 'success' && (
                    <div>
                        <h2>Paciente no encontrado</h2>
                        <h3>Intenta más tarde</h3>
                        <Link to="/">Regresar</Link>
                    </div>
                )}
                {this.state.status === null && (
                    <div>
                        <h2>Cargando...</h2>
                    </div>
                )}
            </div>
        );
    }
}

export default DetailPaciente;