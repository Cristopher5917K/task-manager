import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/navbar.css"
import { Context } from "../store/appContext";
export const Navbar = () => {

	const { store, actions } = useContext(Context)
	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link className="navbar-name" to="/">
					<span className="mb-0 h5">Task Flow</span>
				</Link>
				<div className="ml-auto">
					{
						store.currentUser ?
							<div className="nav-log">
								<Link to="/tasks" className="nav-task">
									<button className="btn"><b>Tasks</b></button>
								</Link>
								<button className="btn btn-danger" onClick={() => actions.logOut()}>
									Log out</button>
								
							</div>
							:
							<>
								<Link to="/register">
									<button className="btn btn-dark">Register</button>
								</Link>
								<Link to="/login">
									<button className="btn btn-secondary ms-2">Login</button>
								</Link>

							</>
					}


				</div>
			</div>
		</nav>
	);
};
