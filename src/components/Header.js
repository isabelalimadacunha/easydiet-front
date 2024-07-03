import React from 'react'; 
import logo from '../easyDietLogo.png';
import AppBar from '@mui/material/AppBar/index.js';
import Toolbar from '@mui/material/Toolbar/index.js';
import Button from '@mui/material/Button/index.js';
import '../index.css';


function Header(){

return(
<div>
        <AppBar position="fixed">
        <Toolbar className="nav-bar">
        <a href="#tela-inicio">
        <img src={logo} className="App-logo" alt="logo" />
        </a>
        <div className='barBtn'>
            <Button href="#tela-sobre" color="inherit" >Sobre</Button>
            <Button href="#tela-formulario" color="inherit">Formulário</Button>
        </div>
        </Toolbar>
        </AppBar>
</div>
);

} 
export default Header;