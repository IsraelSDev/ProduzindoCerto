import React, { useRef, useEffect, useState, FormEvent } from 'react';
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import styles from '../styles/Home.module.css'
import Link from 'next/link';


import { database, firebase } from '../services/firebase.ts';

interface data {
  nome: string,
  indicadora: string,
  lngCoord: number,
  latCoord: number,
}

mapboxgl.accessToken =
  "pk.eyJ1IjoiaXNyYWVsc29hcmVzIiwiYSI6ImNrdmUyeDhsM2JkYm4yem1udDJ4azA3cnkifQ.Zlsg1JsFYg85GMH6qSAPvQ";

function App(): JSX.Element {

  const [nome, setNome] = useState('');
  const [indicadora, setIndicadora] = useState('');
  const [latCoord, setLatCoord] = useState()
  const [lngCoord, setLngCoord] = useState()
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [reloaded, setReloaded] = useState(false);
  const [lng, setLng] = useState('');
  const [lat, setLat] = useState('');
  const [zoom, setZoom] = useState(2);
  const markerHeight = 50;
  const markerRadius = 50;
  const linearOffset = 25;
  const popupOffsets = {
    'top': [0, 0],
    'top-left': [0, 0],
    'top-right': [0, 0],
    'bottom': [0, -markerHeight],
    'bottom-left': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
    'bottom-right': [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
    'left': [markerRadius, (markerHeight - markerRadius) * -1],
    'right': [-markerRadius, (markerHeight - markerRadius) * -1]
  };


  const getAllData = () => {
    const ref = database.ref('empresa');
    ref.on('value', (result: any) => {
      if (result) {
        let datas = Object.entries(result.val()).forEach((val) => {
          console.log(val[1]?.latCoord);
          const popup = new mapboxgl.Popup({ offset: popupOffsets, className: styles.details })
            .setLngLat([val[1]?.lngCoord, val[1]?.latCoord])
            .setHTML(`<h3>Nome: ${val[1]?.nome} </br>Pontos: 0</br>lat: ${val[1]?.latCoord} lng: ${val[1]?.lngCoord}</h3>`)
            .setMaxWidth("300px")
            .addTo(map.current);
        });
      }
    })
  }


  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });
  }, []);

  useEffect(() => {
    getAllData();
  }, [reloaded])

  const sendData = (e: FormEvent) => {
    e.preventDefault()
    const data: data = {
      nome,
      indicadora,
      lngCoord,
      latCoord
    }
    const ref = database.ref('empresa')
    ref.push(data)
    setNome('');
    setIndicadora('');
    setLatCoord('');
    setLngCoord('');
    setReloaded(!reloaded);
  }


  return (<>
    <div className={styles.form}>
      <form onSubmit={sendData}>
        <h3>Cadastre uma empresa</h3>
        <input value={nome} type="text" placeholder="Nome da Empresa:" onChange={(e) => setNome(e.target.value)} />
        <input value={indicadora} type="text" placeholder="Empresa indicadora:" onChange={(e) => setIndicadora(e.target.value)} />
        <div className={styles.box_form}>
          <input value={latCoord} type="number" placeholder="Latitude:" onChange={(e) => setLatCoord(e.target.value)} />
          <input value={lngCoord} type="number" placeholder="Longitude:" onChange={(e) => setLngCoord(e.target.value)} />
        </div>
        <button type='submit'>Cadastrar</button>
      </form>
      <div style={{ display: 'flex', position: 'absolute', top: '10%', right: '10%' }}>

        <span style={{ fontSize: '1.2rem' }}>
          Dica: Para obter coordenadas aleatórias
        </span>
        <Link style={{ color: 'black', fontSize: '1.5rem' }} target={'_blank'} href="https://theonegenerator.com/generators/address/coordinates-generator/"> &nbsp;
          CLIQUE AQUI</Link>
      </div>
    </div>
    <div className={styles.container} ref={mapContainer}></div>
  </>);
}

export default App;