import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import { MapProvider } from './src/context/MapContext';
import Routes from './Routes';

const App = () => {

	return (
		<AuthProvider>
			<MapProvider>
				<Routes />
			</MapProvider>
		</AuthProvider>
	);
}

export default App;