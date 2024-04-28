import React, { useState, useEffect } from 'react';
import { CssBaseline, Grid } from '@material-ui/core';

import {getPlacesData, getWeatherData} from './api/index.js';
import Header from './Header/Header';
import List from './List/List';
import Map from './Map/Map';
import PlaceDetails from './PlaceDetails/PlaceDetails';

const App = () => {
    const [places, setPlaces] = useState([]);
    const [weatherData, setWeatherData] = useState([]);
    const [filteredPlaces, setFilteredPlaces] = useState([]);
    const [childClicked, setChildClicked] = useState(null)
    const [coordinates, setCoordinates] = useState({});
    const [bounds, setBounds] = useState({});
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState('restaurants');
    const [rating, setRating] = useState('');

    //Getting current location of user
    useEffect(()=>{
        navigator.geolocation.getCurrentPosition(({ coords : {latitude, longitude} })=>{
            setCoordinates({ lat : latitude, lng : longitude});
        })
    }, [])

    useEffect(()=>{
        const filteredPlaces = places.filter((place)=> place.rating > rating)
        setFilteredPlaces(filteredPlaces);
    }, [rating]);

    useEffect(() => {
        if(bounds.sw && bounds.ne){
            setLoading(true);

            getWeatherData(coordinates.lat, coordinates.lng).then((data)=> setWeatherData(data))

            getPlacesData(type, bounds.sw, bounds.ne).then((data)=>{
                setPlaces(data?.filter((place)=> place.name && place.num_reviews > 0));
                setFilteredPlaces([])
                setLoading(false)
            })
        }
    }, [type, bounds]);

    return (
        <>
        <CssBaseline/>
        <Header setCoordinates={setCoordinates}/>
        <Grid container spacing={3} style = {{ width : '100%'}}>
            <Grid item xs={12} md={4}>
                <List 
                    places={filteredPlaces.length ? filteredPlaces : places} 
                    childClicked={childClicked} 
                    loading={loading} 
                    type={type} 
                    setType={setType} 
                    rating={rating} 
                    setRating={setRating}
                />
            </Grid>
            <Grid item xs={12} md={8}>
                <Map
                    setCoordinates={setCoordinates}
                    setBounds={setBounds}
                    coordinates={coordinates}
                    places={filteredPlaces.length ? filteredPlaces : places}
                    setChildClicked={setChildClicked}
                    weatherData={weatherData}
                />
            </Grid>
        </Grid>
        </>
    );
}

export default App;