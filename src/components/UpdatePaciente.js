import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import URL from '../common/Global';
import SimpleReactValidator from 'simple-react-validator';

class UpdatePaciente extends Component {
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

    componentDidMount() {
        this.getPacienteById();
    }


    changeState = () => {
        const { paciente } = this.state;
        const rutValue = this.rutRef.current.value || paciente.rut;
        const nombreValue = this.nombreRef.current.value || paciente.nombre;
        const edadValue = this.edadRef.current.value || paciente.edad;
        const sexoValue = this.sexoRef.current.value || paciente.sexo;
        const enfermedadValue = this.enfermedadRef.current.value || paciente.enfermedad;
        const revisadoValue = this.revisadoRef.current.checked;
        const fechaIngresoValue = this.fechaIngresoRef.current.value || paciente.fechaIngreso;
        const photoValue = this.state.photo || paciente.fotoPersonal;
    
        this.setState({
            paciente: {
                ...paciente,
                rut: rutValue,
                nombre: nombreValue,
                edad: edadValue,
                sexo: sexoValue,
                enfermedad: enfermedadValue,
                revisado: revisadoValue,
                fechaIngreso: fechaIngresoValue,
                fotoPersonal: photoValue,
            },
        });
    };
    
    
   
    
    

    fileChange = (e) => {
        this.setState({
            photo: e.target.files[0],
        });
    };

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

    updatePaciente = (e) => {
        e.preventDefault();
        this.changeState();
    
        if (this.validator.allValid()) {
            const formData = new FormData();
            if (this.state.photo !== null) {
                formData.append('file', this.state.photo, this.state.photo.name);
            }
    
            const { paciente } = this.state;
            paciente.revisado = this.revisadoRef.current.checked;
    
            axios.put(`${this.url}/paciente/${this.props.match.params.id}`, paciente)
                .then(res => {
                    if (res.data.paciente) {
                        if (this.state.photo !== null) {
                            const id = res.data.paciente._id;
                            axios.post(this.url + '/paciente/upload/' + id, formData)
                                .then(res => {
                                    if (res.data.status === 'success') {
                                        this.setState(prevState => ({
                                            paciente: {
                                                ...prevState.paciente,
                                                fotoPersonal: res.data.fileName
                                            },
                                            status: 'success',
                                            redirectToHome: true
                                        }));
                                        window.alert('Paciente Actualizado');
                                    } else {
                                        this.setState({
                                            status: 'error'
                                        });
                                    }
                                })
                                .catch(error => {
                                    this.setState({
                                        status: 'error'
                                    });
                                });
                        } else {
                            this.setState({
                                status: 'success',
                                redirectToHome: true
                            });
                        }
                    } else {
                        this.setState({
                            status: 'success',
                            redirectToHome: true
                        });
                    }
                })
                .catch(error => {
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
        const { paciente, status } = this.state;

        if (status === 'success' && this.state.redirectToHome) {
            return <Redirect to={'/'} />;
        }
    
        return (
            <div>
                <form onSubmit={this.updatePaciente}>
                    <table>
                        <tbody>
                            <tr>
                                <td>RUT</td>
                                <td>
                                    <input
                                        type="text"
                                        name="rut"
                                        defaultValue={paciente.rut}
                                        ref={this.rutRef}
                                        onChange={this.changeState}
                                    />
                                    {this.validator.message('rut', paciente.rut, 'required')}
                                </td>
                            </tr>
                            <tr>
                                <td>Nombre</td>
                                <td>
                                    <input
                                        type="text"
                                        name="nombre"
                                        defaultValue={paciente.nombre}
                                        ref={this.nombreRef}
                                        onChange={this.changeState}
                                    />
                                    {this.validator.message('nombre', paciente.nombre, 'required|alpha_space')}
                                </td>
                            </tr>
                            <tr>
                                <td>Edad</td>
                                <td>
                                    <input
                                        type="number"
                                        name="edad"
                                        defaultValue={paciente.edad}
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
                                    {this.validator.message('edad', paciente.edad, 'required|numeric')}
                                </td>
                            </tr>
                            <tr>
                                <td>Sexo</td>
                                <td>
                                    <input
                                        type="text"
                                        name="sexo"
                                        defaultValue={paciente.sexo}
                                        ref={this.sexoRef}
                                        onChange={this.changeState}
                                    />
                                    {this.validator.message('sexo', paciente.sexo, 'required|alpha')}
                                </td>
                            </tr>
                            <tr>
                                <td>Enfermedad</td>
                                <td>
                                    <input
                                        type="text"
                                        name="enfermedad"
                                        defaultValue={paciente.enfermedad}
                                        ref={this.enfermedadRef}
                                        onChange={this.changeState}
                                    />
                                    {this.validator.message('enfermedad', paciente.enfermedad, 'required|alpha_num_space')}
                                </td>
                            </tr>
                            <tr>
                                <td>Fecha de Ingreso</td>
                                <td>
                                    <input
                                        type="date"
                                        name="fechaIngreso"
                                        defaultValue={paciente.fechaIngreso}
                                        ref={this.fechaIngresoRef}
                                        onChange={this.changeState}
                                        max={new Date().toISOString().split('T')[0]}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>Revisado</td>
                                <td>
                                    <input
                                        type="checkbox"
                                        name="revisado"
                                        defaultChecked={paciente.revisado}
                                        ref={this.revisadoRef}
                                        onChange={this.changeState}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>Foto</td>
                                <td>
                                    <input type="file" name="file" onChange={this.fileChange} />
                                    {paciente.fotoPersonal !== null ? (
                                        <img
                                            src={this.url + '/paciente/archivo/' + paciente.fotoPersonal}
                                            alt={paciente.fotoPersonal}
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
                                    <input type="submit" value="Actualizar Paciente" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>
        );
    }
}

export default UpdatePaciente;
