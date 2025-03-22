import React, { useContext } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";
import introPicture from "../../img/intro-picture.png"
import organizationPicture from "../../img/organization-picture.png"
import { Link } from "react-router-dom";
const Home = () => {


	return (
		<>
			<div className="intro-container">
				<img src={introPicture} className="intro-picture" />
				<div className="app-intro">
					<h1 className="intro-title"><b>Task Flow</b></h1>
					<p className="intro-text">
						Task Flow is an application designed to help you organize your tasks and structure your day more efficiently.
						With Task Flow, you can bring order to your daily routine and stay on top of what matters most.
					</p>
				</div>
			</div>
			<div className="info-container">
				<h1 className="info-title"><b>What you can do?</b></h1>
				<p className="info-text">
					In our application, you can easily add and organize your tasks based on their importance,
					helping you prioritize and make the most out of each day.
				</p>
			</div>
			<div className="organization-container">
				<div className="organization-text">
					<h1>The Organization</h1>
					<h3>HIGH</h3>
					<p>
						Tasks marked as High Importance are critical and should be completed as a top priority.
						These are essential tasks that require your immediate attention.
					</p>
					<h3>MEDIUM</h3>
					<p>
						Tasks marked as Mid Importance are important but not urgent. These should be addressed after completing
						your high-priority tasks or scheduled for later in the day.
					</p>
					<h3>LOW</h3>
					<p>
						Tasks marked as Low Importance are non-urgent and can be done at your convenience.
						These tasks do not significantly impact your day if postponed.
					</p>
				</div>
				<img src={organizationPicture} className="organization-image" />
			</div>
			<div className="start-container">
				<h1>To be part of Task Flow</h1>
				<Link to="/register">
					<button className="btn btn-dark start-button">Register</button>
				</Link>
		
			</div>
		</>
	);
};

export default Home;
