import React, { lazy, Suspense } from 'react';
import { Provider } from 'react-redux';
import { storeData } from './data/dataStore';

const GeoSyriaConnector = lazy(() => import('./GeoSyriaConnector'));
const Infos = lazy(() => import('./Infos'))

export const GeoSyria = () => {
    return (
        <Provider store={storeData} >
            <Suspense fallback={<div style={{backgroundColor: '#000'}}>Loading...</div>}>
                <Infos/>
                <GeoSyriaConnector/>
            </Suspense>
        </Provider>
    )
}