import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Index from '../components/Home';
import NotFound from '../routes/404';
import NewPaciente from '../components/NewPaciente';
import UpdatePaciente from '../components/UpdatePaciente';
import Paciente from '../components/DetailPaciente';
import ListPacientes from '../components/ListPacientes';
import Seeker from '../components/Seeker';
import Menu from './Menu';

class Router extends Component {
    render() {
        return (
            <BrowserRouter>
                <Menu></Menu>
                <Switch>
                    <Route exact path="/" component={Index}></Route>
                    <Route exact path="/inicio" component={Index}></Route>
                    <Route path="/paciente/new" component={NewPaciente}></Route>
                    <Route path="/paciente/update/:id" component={UpdatePaciente}></Route>
                    <Route path="/paciente/detail/:id" component={Paciente}></Route>
                    <Route path="/paciente/list" component={ListPacientes}></Route>
                    <Route path="/paciente/search/:search" component={Seeker}></Route>
                    <Route path="/redirect/:search" render={(props) => {
                        var search = props.match.params.search;
                        return (<Redirect to={'/paciente/search/' + search}></Redirect>);
                    }}></Route>
                    <Route path="*" component={NotFound}></Route>
                </Switch>
            </BrowserRouter>
        );
    }
}

export default Router;
