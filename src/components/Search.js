import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';

class Search extends Component{
    searchRef= React.createRef();

    state={
        search:"",
        redirect:false
    };

    searchByField=(e)=>{
        e.preventDefault();
        this.setState({
            search:this.searchRef.current.value,
            redirect:true
        })
    }

    render(){
        if(this.state.redirect){
            return (
                <Redirect to={'/redirect/'+this.state.search}></Redirect>
            );
        }
        
        return(
            <div>
                <form onSubmit={this.searchByField}>
                    <table>
                        <tr>
                            <td>Buscar</td>
                            <td><input type="text" name="search" ref={this.searchRef}/></td>
                            <td><input type="submit" name="submit" value="Buscar"/></td>
                        </tr>
                    </table>
                </form>
            </div>
        );
    }
}

export default Search