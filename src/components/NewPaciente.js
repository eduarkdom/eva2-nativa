import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import URL from '../common/Global';
import SimpleReactValidator from 'simple-react-validator';

class NewPaciente extends Component {
    constructor(props) {
        super(props);

        this.url = URL.API;
        this.rutRef = React.createRef();
        this.nombreRef = React.createRef();
        this.edadRef = React.createRef();
        this.sexoRef = React.createRef();
        this.enfermedadRef = React.createRef();
        this.fechaIngresoRef = React.createRef();
        this.revisadoRef = React.createRef();

        this.state = {
            paciente: {
                rut: '',
                nombre: '',
                edad: '',
                sexo: '',
                fotoPersonal: null,
                fechaIngreso: '',
                enfermedad: '',
                revisado: false,
            },
            status: null,
            photo: null,
            force: false,
        };

        this.validator = new SimpleReactValidator();
    }

    changeState = () => {
        const rutValue = this.rutRef?.current?.value || '';
        const nombreValue = this.nombreRef?.current?.value || '';
        const edadValue = this.edadRef?.current?.value || '';
        const sexoValue = this.sexoRef?.current?.value || '';
        const enfermedadValue = this.enfermedadRef?.current?.value || '';
        const revisadoValue = this.revisadoRef?.current?.checked || false;
        const fechaIngresoValue = this.fechaIngresoRef?.current?.value || '';

        this.setState({
            paciente: {
                rut: rutValue,
                nombre: nombreValue,
                edad: edadValue,
                sexo: sexoValue,
                fotoPersonal: this.fotoPersonalRef?.current?.value || null,
                fechaIngreso: fechaIngresoValue,
                enfermedad: enfermedadValue,
                revisado: revisadoValue,
            },
        });
    };

    fileChange = (e) => {
        this.setState({
            photo: e.target.files[0],
        });
    };

    newPaciente = (e) => {
        e.preventDefault();
        this.changeState();

        if (this.validator.allValid()) {
            axios.post(this.url + "/paciente", this.state.paciente)
                .then(res => {
                    if (res.data.status === 'success') {
                        const newPaciente = res.data.patient;
                        this.setState({
                            paciente: newPaciente,
                            status: 'waiting'
                        });

                        if (this.state.photo !== null) {
                            const id = newPaciente._id;
                            const formData = new FormData();
                            formData.append('file', this.state.photo, this.state.photo.name);

                            axios.post(this.url + "/paciente/upload/" + id, formData)
                                .then(res => {
                                    if (res.data.status === 'success') {
                                        this.setState({
                                            status: 'success',
                                            force: true
                                        });
                                        window.alert('Paciente Creado');
                                    } else {
                                        this.setState({
                                            status: 'error'
                                        });
                                    }
                                })
                                .catch(error => {
                                    console.error('Error uploading photo:', error);
                                    this.setState({
                                        status: 'error'
                                    });
                                });
                        } else {
                            this.setState({
                                status: 'success',
                                force: true
                            });
                        }
                    } else {
                        this.setState({
                            status: 'error'
                        });
                    }
                })
                .catch(error => {
                    console.error('Error creating paciente:', error);
                    this.setState({
                        status: 'error'
                    });
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
        if (this.state.force) {
            return <Redirect to="/" />;
        }
        return (
            <div>
                <form onSubmit={this.newPaciente}>
                    <table>
                        <tbody>
                            <tr>
                                <td>RUT</td>
                                <td>
                                    <input type="text" name="rut" ref={this.rutRef} onChange={this.changeState} />
                                    {this.validator.message('rut', this.state.paciente.rut, 'required')}
                                </td>
                            </tr>
                            <tr>
                                <td>Nombre</td>
                                <td>
                                    <input type="text" name="nombre" ref={this.nombreRef} onChange={this.changeState} />
                                    {this.validator.message('nombre', this.state.paciente.nombre, 'required|alpha_space')}
                                </td>
                            </tr>
                            <tr>
                                <td>Edad</td>
                                <td>
                                    <input
                                        type="number"
                                        name="edad"
                                        ref={this.edadRef}
                                        onChange={this.changeState}
                                        onKeyDown={(e) => {
                                            const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', '.', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
                                            if (!allowedKeys.includes(e.key) || (e.target.value === '' && e.key === '0') || (e.target.value === '0' && e.key !== '.')) {
                                                e.preventDefault();
                                            }
                                        }}
                                        min={1}
                                        step="0.01"
                                    />
                                    {this.validator.message('edad', this.state.paciente.edad, 'required|numeric')}
                                </td>
                            </tr>
                            <tr>
                                <td>Sexo</td>
                                <td>
                                    <input type="text" name="sexo" ref={this.sexoRef} onChange={this.changeState} />
                                    {this.validator.message('sexo', this.state.paciente.sexo, 'required|alpha')}
                                </td>
                            </tr>
                            <tr>
                                <td>Enfermedad</td>
                                <td>
                                    <input type="text" name="enfermedad" ref={this.enfermedadRef} onChange={this.changeState} />
                                    {this.validator.message('enfermedad', this.state.paciente.enfermedad, 'required|alpha_num_space ')}
                                </td>
                            </tr>
                            <tr>
                                <td>Fecha de Ingreso</td>
                                <td>
                                    <input type="date" name="fechaIngreso" ref={this.fechaIngresoRef} onChange={this.changeState} max={new Date().toISOString().split('T')[0]} />
                                </td>
                            </tr>
                            <tr>
                                <td>Revisado</td>
                                <td>
                                    <input type="checkbox" name="revisado" ref={this.revisadoRef} onChange={this.changeState} />
                                </td>
                            </tr>
                            <tr>
                                <td>Foto</td>
                                <td>
                                    <input type="file" name="photo" onChange={this.fileChange} />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <input type="submit" value="Crear Paciente" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
                {this.state.force && <Redirect to="/" />}
            </div>
        );
    }
}

export default NewPaciente;
