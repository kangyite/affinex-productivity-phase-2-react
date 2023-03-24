import SideNav, { NavItem, NavIcon, NavText } from "@trendmicro/react-sidenav";
import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import { useNavigate } from "react-router-dom";

function NavBar() {
	const navigate = useNavigate();
	return (
		<SideNav
			onSelect={(selected) => {
				navigate(selected);
			}}
		>
			<SideNav.Toggle />
			<SideNav.Nav defaultSelected="home">
				<NavItem eventKey="/">
					<NavIcon>
						<i className="fa fa-fw fa-home" style={{ fontSize: "1.75em" }} />
					</NavIcon>
					<NavText>Home</NavText>
				</NavItem>
				<NavItem eventKey="/data">
					<NavIcon>
						<i
							className="fa fa-fw fa-line-chart"
							style={{ fontSize: "1.75em" }}
						/>
					</NavIcon>
					<NavText>Data</NavText>
				</NavItem>
			</SideNav.Nav>
		</SideNav>
	);
}

export default NavBar;
