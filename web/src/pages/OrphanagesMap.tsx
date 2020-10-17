import React, { useEffect, useState } from 'react'
import { FiArrowRight, FiPlus } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { Map, Marker, TileLayer, Popup } from 'react-leaflet'

import MapMarkerImg from '../images/map-marker.svg'
import mapIcon from '../utils/mapIcon'

import '../styles/pages/orphanages-map.css'
import api from '../services/api'

interface Orphanage {
    id: number,
    latitude: number,
    longitude: number,
    name: string
}

function Orfanatos() {

    const [longitude, setLongitude] = useState(0);
    const [latitude, setLatitude] = useState(0);


    navigator.geolocation.getCurrentPosition(position => {
        setLongitude(position.coords.longitude)
        setLatitude(position.coords.latitude)
    })
    console.log(longitude, latitude)


    const [orphanages, setOrphanages] = useState<Orphanage[]>([])

    useEffect(() => {
        api.get('orphanages').then(res => {
            setOrphanages(res.data)
        })
    }, []);

    return (
        <div id="page-map">
            <aside>
                <header>
                    <img src={MapMarkerImg} alt="mapa" />

                    <h2>Escolha um orfanato no mapa</h2>
                    <p>Muitas crianças estão esperando a sua visita :)</p>
                </header>

                <footer>
                    <strong>São Paulo</strong>
                    <span>SP</span>
                </footer>
            </aside>

            <Map
                center={[latitude, longitude]}
                zoom={15}
                style={{ width: '100%', height: '100%' }}>
                <TileLayer url={`https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`} />

                {orphanages.map(orphanage => {
                    return (<Marker
                        icon={mapIcon}
                        position={[orphanage.latitude, orphanage.longitude]}
                        key={orphanage.id}
                    >
                        <Popup closeButton={false} minWidth={240} maxWidth={240} className="map-popup">
                            {orphanage.name}
                            <Link to={`/orphanages/${orphanage.id}`}>
                                <FiArrowRight size={20} color="#fff" />
                            </Link>
                        </Popup>
                    </Marker>
                    )
                })}

            </Map>

            <Link to="/orphanages/create" className="create-orphanage">
                <FiPlus size={32} color="#FFF" />
            </Link>

        </div>
    );
}

export default Orfanatos