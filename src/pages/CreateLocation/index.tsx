import React, { ChangeEvent, FormEvent, useEffect,useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import logo from '../../assets/logo.svg';
import api from '../../services/api';
import './styles.css';

interface Item {
    id:string,
    title:string,
    image_url: string
}

const CreateLocation:React.FC = () =>{
    const [items,setItems] = useState<Item[]>();
    const [selectedMapPosition,setSelectedMapPosition] = useState<[number,number]>([0,0])
    const [formData,setFormData] = useState({
        name:'',
        email:'',
        whatsapp:'',
        city:'',
        uf:'',
    });
    const [selectedItems,setSelectedItems] = useState<number[]>([])

    useEffect(()=>{
        api.get('items').then(response=>{
            setItems(response.data)
        }).catch(error=>{
            console.log(error)
        });
    },[]);

    function handleMapClick(event:LeafletMouseEvent):void{
        setSelectedMapPosition([
            event.latlng.lat,
            event.latlng.lng
        ])
    }

    function handleInputChange(event:ChangeEvent<HTMLInputElement>){
        console.log(event.target.name, event.target.value)
        const { name,value } = event.target;
        setFormData({...formData,[name]:value})
    }

    async function handleSubmit(event:FormEvent){
        event.preventDefault();
        const { city, email, name, uf, whatsapp } = formData;
        const [ latitude, longitude ] = selectedMapPosition;
        const items = selectedItems;

        const data = {
            city,
            email,
            name,
            uf,
            whatsapp,
            latitude,
            longitude,
            items
        }
        await api.post('locations', data)
        
    }

    function handleSelectItem(id:number){
        
        const alreadySelected = selectedItems.findIndex(item => item === id)
        console.log(alreadySelected)
        if(alreadySelected >= 0){
            const filteredItems = selectedItems.filter(item => item !== id)
            setSelectedItems(filteredItems)
        }else{
            setSelectedItems([...selectedItems,id])
        }
    }

    return (
        <div id="page-create-location">
            <div className="content">
                <header>
                    <img src={logo} alt="Coleta Seletiva"/>
                    <Link to="/">
                        <FiArrowLeft />
                        Voltar para home
                    </Link>
                </header>

                <form onSubmit={handleSubmit}>
                    <h1>Cadastro do <br /> local de coleta</h1>

                    <fieldset>
                        <legend>
                            <h2>Dados</h2>
                        </legend>

                        <div className="field">
                            <label htmlFor="name">Nome da entidade</label>
                            <input 
                                type="text"
                                name="name"
                                id="name"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="field-group">
                            <div className="field">
                                <label htmlFor="email">E-mail</label>
                                <input 
                                    type="email"
                                    name="email"
                                    id="email"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="whatsapp">Whatsapp</label>
                                <input 
                                    type="text"
                                    name="whatsapp"
                                    id="whatsapp"
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend>
                        <h2>Endere??o</h2>
                            <span>Marque o endere??o no mapa</span>
                        </legend>
                        <Map  center={[-23.0003709,-43.365895]} zoom={14} onclick={handleMapClick}>
                        <TileLayer
                                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={selectedMapPosition}/>
                        </Map>
                        <div className="field-group">
                            <div className="field">
                                <label htmlFor="city">Cidade</label>
                                <input 
                                    type="text"
                                    name="city"
                                    id="city"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="uf">Estado</label>
                                <input 
                                    type="text"
                                    name="uf"
                                    id="uf"
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend>
                            <h2>??tens coletados</h2>
                            <span>Voc?? pode marcar um ou mais ??tens</span>
                        </legend>
                        <ul className="items-grid">
                            {
                            items?.map(item=>(
                            <li 
                                key={item.id} 
                                onClick={()=> handleSelectItem(Number(item.id))}
                                className={selectedItems.includes(Number(item.id)) ? 'selected' : ''}
                                >
                                <img src={item.image_url} alt={item.title} />
                            </li>
                        ))
                        }
                        </ul>
                    </fieldset>

                    <button type="submit">
                        Cadastrar local de coleta
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateLocation;