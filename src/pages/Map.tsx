import { Stack, Typography } from '@mui/material';

import MapWrapper from '../components/Map/MapWrapper';

const Map = () => (
	<Stack alignItems="center">
		<Typography variant="h4" component="h1" sx={{ margin: '1.4rem' }}>
			Map
		</Typography>
		<MapWrapper />
	</Stack>
);

export default Map;
