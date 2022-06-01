import {
	Box,
	Button,
	Drawer,
	IconButton,
	Stack,
	styled,
	Theme,
	Toolbar,
	Tooltip,
	Typography,
	useTheme
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LogoutIcon from '@mui/icons-material/Logout';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEffect, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';

import { useEntries } from '../contexts/EntriesContext';
import { defaultEntry } from '../data';
import useUserContext from '../contexts/UserContext';
import { logOut } from '../utils/firebase';

import { drawerWidth } from './Layout';
import LocationList from './LocationList';
import FilterList from './FilterList';

type AppBarProps = {
	open?: boolean;
} & MuiAppBarProps;

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: prop => prop !== 'open'
})<AppBarProps>(({ theme, open }) => ({
	transition: theme.transitions.create(['margin', 'width'], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen
	}),
	...(open && {
		width: `calc(100% - ${drawerWidth}px)`,
		marginLeft: `${drawerWidth}px`,
		transition: theme.transitions.create(['margin', 'width'], {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen
		})
	})
}));

export const DrawerHeader = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
	justifyContent: 'flex-end'
}));

const Navbar = ({ open, setOpen }: { open: boolean; setOpen: any }) => {
	const { setCurrentEntry } = useEntries();
	const location = useLocation();
	const [toggleFilter, setToggle] = useState<boolean>(false);
	const { loading, user } = useUserContext();
	const matches = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
	const currentDrawerWidth = matches ? 'fit-content' : drawerWidth;

	useEffect(() => {
		setOpen(false);
	}, [location]);

	const theme = useTheme();

	const handleDrawerOpen = () => {
		setToggle(false);
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setToggle(false);
		setOpen(false);
	};

	return (
		<Box
			sx={{
				flexGrow: 1,
				alignItems: 'center'
			}}
		>
			<AppBar position="static" open={open}>
				<Toolbar
					sx={{
						background: 'linear-gradient(to right, #096DD7, #5779EC, #8F84F8)',
						justifyContent: 'space-between'
					}}
				>
					<Box>
						<Tooltip title="Seznam lokalit">
							<IconButton
								color="inherit"
								aria-label="open drawer"
								onClick={handleDrawerOpen}
								edge="start"
								sx={{ mr: 2, ...(open && { display: 'none' }) }}
							>
								<ListAltIcon />
							</IconButton>
						</Tooltip>

						<Button
							sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
							component={Link}
							to="/"
							color="inherit"
						>
							<Typography variant="h6">Krajanská mapa</Typography>
						</Button>
					</Box>

					{!loading && (
						<Stack direction="row" spacing={2}>
							<Button
								component={Link}
								to="/"
								onClick={() => setCurrentEntry(defaultEntry)}
								color="inherit"
							>
								Mapa
							</Button>

							{user ? (
								<>
									<Button
										component={Link}
										to="/admin/new"
										onClick={() => setCurrentEntry(defaultEntry)}
										color="inherit"
									>
										Editor
									</Button>
									<Tooltip sx={{ ml: 4 }} title="Odhlášení">
										<IconButton
											component={Link}
											onClick={logOut}
											to="/login"
											color="inherit"
										>
											<LogoutIcon />
										</IconButton>
									</Tooltip>
								</>
							) : (
								<Button component={Link} to="/login" color="inherit">
									Přihlášení
								</Button>
							)}
						</Stack>
					)}
				</Toolbar>
			</AppBar>
			<Drawer
				sx={{
					'width': currentDrawerWidth,
					'flexShrink': 0,
					'& .MuiDrawer-paper': {
						width: currentDrawerWidth,
						boxSizing: 'border-box'
					}
				}}
				variant="persistent"
				anchor="left"
				open={open}
			>
				<DrawerHeader
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						borderRadius: '0 0 5px',
						borderColor: 'primary.main',
						borderStyle: 'solid',
						borderWidth: '1px',
						borderTop: 'none',
						borderRight: 'none'
					}}
				>
					{toggleFilter ? (
						<Stack
							direction="row"
							spacing={2}
							paddingLeft={2}
							alignItems="center"
						>
							<Typography component="h1" variant="h5">
								Filtry
							</Typography>

							<Tooltip title="Zpět na lokality">
								<IconButton
									onClick={() => {
										setToggle(!toggleFilter);
									}}
									color="primary"
								>
									<ArrowBackIcon />
								</IconButton>
							</Tooltip>
						</Stack>
					) : (
						<Stack
							direction="row"
							spacing={2}
							paddingLeft={2}
							alignItems="center"
						>
							<Typography component="h1" variant="h5">
								Seznam lokalit
							</Typography>
							<Tooltip title="Filtrovat lokality">
								<IconButton
									onClick={() => {
										setToggle(!toggleFilter);
									}}
									color="primary"
								>
									<FilterAltOutlinedIcon />
								</IconButton>
							</Tooltip>
						</Stack>
					)}

					<IconButton
						sx={{ color: 'primary.main' }}
						onClick={handleDrawerClose}
					>
						{theme.direction === 'ltr' ? (
							<ChevronLeftIcon />
						) : (
							<ChevronRightIcon />
						)}
					</IconButton>
				</DrawerHeader>
				{toggleFilter ? (
					<FilterList />
				) : (
					<LocationList setDrawerOpen={setOpen} />
				)}
			</Drawer>
		</Box>
	);
};

export default Navbar;
