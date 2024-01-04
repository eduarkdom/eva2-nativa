import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import URL from '../common/Global';

class DetailPaciente extends Component {
    url = URL.API;

    state = {
        paciente: false,
        status: null
    };

    componentDidMount() {
        this.getPacienteById();
    }

    getPacienteById = () => {
        var id = this.props.match.params.id;
        axios.get(this.url + "/paciente/id/" + id).then(res => {
            this.setState({
                paciente: res.data.paciente,
                status: 'success'
            });
        }).catch(err => {
            this.setState({
                paciente: false,
                status: 'success'
            });
        });
    };

    deletePacienteById = (id) => {
        axios.delete(this.url + "/paciente/" + id).then(res => {
            this.setState({
                paciente: res.data.paciente,
                status: 'deleted'
            });
        });
    };

    render() {
        return (
            <div>
                {
                    this.state.status === 'deleted' && <Redirect to="/" />
                }
                {
                    this.state.paciente &&
                    <div>
                        <table border="1px">
                            <tr>
                                <td>Paciente</td>
                                <td>{this.state.paciente.fullname}</td>
                            </tr>
                            <tr><td>Created at</td><td>{this.state.paciente.createdAt}</td></tr>
                            <tr>
                                <td>Email</td>
                                <td>{this.state.paciente.email}</td>
                            </tr>
                            <tr>
                                <td>Imagen</td>
                                {
                                    this.state.paciente.photo !== null ? (
                                        <img src={this.url + '/paciente/archivo/' + this.state.paciente.photo} alt={this.state.paciente.photo} width="275px" height="250px" />
                                    ) : (
                                        <img src="https://pbs.twimg.com/media/ERfnjPtWoAYbAad.jpg" alt="" />
                                    )
                                }
                            </tr>
                            <tr>
                                <td><Link to={'/paciente/' + this.state.paciente._id}>Update</Link></td>
                                <td><button onClick={() => { this.deletePacienteById(this.state.paciente._id) }}>Delete</button></td>
                            </tr>
                        </table>
                    </div>
                }
                {
                    !this.state.paciente && this.state.status === 'success' &&
                    <div>
                        <h2>Paciente not found</h2>
                        <h3>Try later</h3>
                        <Link to={'/'}>Get back</Link>
                    </div>
                }
                {
                    this.state.status === null &&
                    <div>
                        <h2>Loading...</h2>
                    </div>
                }
            </div>
        );
    }
}

export default DetailPaciente;
