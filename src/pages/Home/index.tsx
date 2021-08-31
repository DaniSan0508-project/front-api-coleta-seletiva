import React from "react";
import { FiLogIn } from 'react-icons/fi';
import './styles.css';
import logo from '../../assets/logo.svg';
import { Link } from 'react-router-dom';

const Home:React.FC = () =>{
    return(
       <div id="page-home">
           <div className="content">
               <header>
                   <img src={logo} alt="Reciclagem"></img>
               </header>

               <main>
                    <h1>Coleta seletiva e recliclagem em geral</h1>
                    <p>Reciclagem de materiais diversos, tais como, papel, plástico, metal</p>

                    <Link to="/create-location">
                        <span>
                            <FiLogIn/>
                        </span>
                        <strong>Cadastrar novo local de coleta</strong>
                    </Link>
               </main>
           </div>
       </div>
    );
};

export default Home;