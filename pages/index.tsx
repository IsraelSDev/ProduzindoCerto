import React, { useRef, useEffect, useState, FormEvent, use } from 'react';
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import styles from '../styles/Home.module.css'
import Link from 'next/link';
import { database, firebase } from '../services/firebase';

interface coordI {
  nome: string,
  indicadora: string,
  lngCoord: number,
  latCoord: number,
}

mapboxgl.accessToken =
  "pk.eyJ1IjoiaXNyYWVsc29hcmVzIiwiYSI6ImNrdmUyeDhsM2JkYm4yem1udDJ4azA3cnkifQ.Zlsg1JsFYg85GMH6qSAPvQ";

function App(): JSX.Element {

  const [nome, setNome] = useState<any>('');
  const [indicadora, setIndicadora] = useState<any>('');
  const [updating, setUpdating] = useState<any>(false);
  const [indicate, setIndicate] = useState<any>('');
  const [latCoord, setLatCoord] = useState<any>('')
  const [lngCoord, setLngCoord] = useState<any>('')
  const mapContainer = useRef<any>(null);
  const map = useRef<any>(null);
  const [reloaded, setReloaded] = useState<any>();
  const [lng, setLng] = useState<number>(0);
  const [lat, setLat] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(2);
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const markerHeight = 50;
  const markerRadius = 50;
  const linearOffset = 25;
  const popupOffsets: any = {
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
        const datas: void = Object.entries(result.val()).forEach((val: any) => {
          const popup = new mapboxgl.Popup({ offset: popupOffsets, className: styles.details })
            .setLngLat([val[1]?.lngCoord, val[1]?.latCoord])
            .setHTML(`<h3>Nome: ${val[1]?.nome} </br>Pontos: ${val[1]?.point}</br>lat: ${val[1]?.latCoord} lng: ${val[1]?.lngCoord}</h3>`)
            .setMaxWidth("300px")
            .addTo(map.current);
        })
      }
    })
  }
  const updatePoint = () => {
    const ref = database.ref('empresa');
    ref.on('value', (val: any) => {
      const values = Object.entries(val.val()).forEach((val: any) => {
        if (val[1]?.nome == indicate) {
          ref.child(`${val[0]}`).update({ point: val[1]?.point + 10 })
          setUpdating(false);
        }
      })
    })
  }

  useEffect(() => {
    updatePoint();
  }, [updating])


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
    setIndicadora('');
    setNome('');
    setLatCoord('');
    setLngCoord('');
  }, [reloaded])

  const sendData = (e: FormEvent) => {
    e.preventDefault()
    const point = 0
    const data: any = {
      nome,
      indicadora,
      latCoord,
      lngCoord,
      point,
    }
    const ref = database.ref('empresa')
    ref.push(data)
    setReloaded(!reloaded);
    setUpdating(true);
  }


  return (<>
    <div className={styles.form}>
      <form onSubmit={sendData}>
        <h3>Cadastre uma empresa</h3>
        <input required value={nome} type="text" placeholder="Nome da Empresa:" onChange={(e) => setNome(e.target.value)} />
        <input required value={indicadora} type="text" placeholder="Empresa indicadora:" onChange={(e) => {
          setIndicadora(e.target.value);
          setIndicate(e.target.value);
        }} />
        <div className={styles.box_form}>
          <input required value={latCoord} type="number" max={90} min={-90} placeholder="Latitude:" onChange={(e) => setLatCoord(e.target.value)} />
          <input required value={lngCoord} type="number" max={90} min={-90} placeholder="Longitude:" onChange={(e) => setLngCoord(e.target.value)} />
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