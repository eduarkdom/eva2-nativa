import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import URL from '../common/Global';
import SimpleReactValidator from 'simple-react-validator';

class NewPaciente extends Component {
    url = URL.API;
    fullnameRef = React.createRef();
    emailRef = React.createRef();

    state = {
        paciente: {},
        status: null,
        photo: null,
        force: false
    };

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

    newPaciente = (e) => {
        e.preventDefault();
        this.changeState();
        if (this.validator.allValid()) {
            axios.post(this.url + "/paciente", this.state.paciente).then(res => {
                if (res.data.newPaciente) {
                    this.setState({
                        paciente: res.data.newPaciente,
                        status: 'waiting'
                    });
                    if (this.state.photo !== null) {
                        console.log(this.state.paciente);
                        var id = this.state.paciente._id;
                        const formData = new FormData();
                        formData.append('file', this.state.photo, this.state.photo.name);

                        axios.post(this.url + "/paciente/upload/" + id, formData).then(res => {
                            if (res.data.paciente) {
                                this.setState({
                                    paciente: res.data.paciente,
                                    status: 'success',
                                    force: true
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
        return (
            <div>
                <form onSubmit={this.newPaciente}>
                    <table>
                        <tbody>
                            <tr>
                                <td>Fullname</td>
                                <td><input type="text" name="fullname" ref={this.fullnameRef} onChange={this.changeState} /></td>
                                {
                                    this.validator.message('fullname', this.state.paciente.fullname, 'required|alpha_space')
                                }
                            </tr>
                            <tr>
                                <td>Email</td>
                                <td><input type="text" name="email" ref={this.emailRef} onChange={this.changeState} /></td>
                                {
                                    this.validator.message('email', this.state.paciente.email, 'required|email')
                                }
                            </tr>
                            <tr>
                                <td>Photo</td>
                                <td><input type="file" name="photo" onChange={this.fileChange} /></td>
                            </tr>
                            <tr>
                                <td><input type="submit" value="Create Paciente" /></td>
                            </tr>
                        </tbody>
                    </table>
                </form>
                {
                    this.state.force && <Redirect to="/" />
                }
            </div>
        );
    }
}

export default NewPaciente;
