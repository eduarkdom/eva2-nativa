import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import URL from '../common/Global';
import SimpleReactValidator from 'simple-react-validator';

class UpdatePaciente extends Component {
    url = URL.API;
    fullnameRef = React.createRef();
    emailRef = React.createRef();
    pacienteId = null;

    state = {
        paciente: {},
        status: null,
        photo: null,
        new: ''
    };

    componentDidMount() {
        this.pacienteId = this.props.match.params.id;
        this.getPacienteById(this.pacienteId);
    }

    validator = new SimpleReactValidator();

    changeState = () => {
        this.setState({
            paciente: {
                fullname: this.fullnameRef.current.value,
                email: this.emailRef.current.value
            }
        });

        this.validator.showMessages();
        this.forceUpdate();
    };

    fileChange = (e) => {
        this.setState({
            photo: e.target.files[0]
        });
    };

    getPacienteById = (id) => {
        axios.get(this.url + '/paciente/id/' + id).then(res => {
            this.setState({
                paciente: res.data.paciente,
                new: res.data.paciente.photo
            });
        });
    };

    updatePaciente = (e) => {
        e.preventDefault();
        this.changeState();
        if (this.validator.allValid()) {
            axios.put(this.url + '/paciente/' + this.pacienteId, this.state.paciente).then(res => {
                if (res.data.paciente) {
                    this.setState({
                        paciente: res.data.paciente,
                        status: 'waiting'
                    });
                    if (this.state.photo !== null) {
                        var id = this.state.paciente._id;
                        const formData = new FormData();
                        formData.append('file', this.state.photo, this.state.photo.name);

                        axios.post(this.url + '/paciente/upload/' + id, formData).then(res => {
                            if (res.data.paciente) {
                                this.setState({
                                    paciente: res.data.paciente,
                                    status: 'success'
                                });
                            } else {
                                this.setState({
                                    paciente: res.data.paciente,
                                    status: 'error'
                                });
                            }
                        });
                    } else {
                        this.setState({
                            status: 'success'
                        });
                    }
                } else {
                    this.setState({
                        status: 'success'
                    });
                }
            });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
            this.setState({
                status: 'error'
            });
        }
    };

    render() {
        if (this.state.status === 'success') {
            return <Redirect to={'/'} />;
        }
        var paciente = this.state.paciente;
        return (
            <div>
                <form onSubmit={this.updatePaciente}>
                    <table>
                        <tr>
                            <td>Fullname</td>
                            <td>
                                <input
                                    type="text"
                                    name="fullname"
                                    defaultValue={paciente.fullname}
                                    ref={this.fullnameRef}
                                    onChange={this.changeState}
                                />
                                {this.validator.message('fullname', this.state.paciente.fullname, 'required|alpha_space')}
                            </td>
                        </tr>
                        <tr>
                            <td>Email</td>
                            <td>
                                <input
                                    type="text"
                                    name="email"
                                    defaultValue={paciente.email}
                                    ref={this.emailRef}
                                    onChange={this.changeState}
                                />
                                {this.validator.message('email', this.state.paciente.email, 'required|email')}
                            </td>
                        </tr>
                        <tr>
                            <td>Photo</td>
                            <td>
                                <input type="file" name="file" onChange={this.fileChange} />
                                {this.state.paciente.photo !== null ? (
                                    <img
                                        src={this.url + '/paciente/archivo/' + this.state.new}
                                        alt={this.state.paciente.photo}
                                        width="275px"
                                        height="250px"
                                        id="photo"
                                    />
                                ) : (
                                    <img src="https://pbs.twimg.com/media/ERfnjPtWoAYbAad.jpg" alt="" id="photo" />
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <input type="submit" value="Update Paciente" />
                            </td>
                        </tr>
                    </table>
                </form>
            </div>
        );
    }
}

export default UpdatePaciente;
