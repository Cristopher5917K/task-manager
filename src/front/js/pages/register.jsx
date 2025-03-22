import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom"; 
import "../../styles/register.css"

const initialUser = { 
    name: "",
    email: "",
    password: ""
};

const Register = () => {
 
    const [user, setUser] = useState(initialUser)
    const { actions } = useContext(Context)

    const handleChange = ({ target }) => {
        setUser({
            ...user,
            [target.name]: target.value
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()


        const formData = new FormData()
        formData.append("name", user.name)
        formData.append("email", user.email)
        formData.append("password", user.password)
        formData.append("avatar", user.avatar)

        const response = await actions.register(formData)

        if (response == 200) {
            setUser(initialUser)
            alert("El usuario se registro correctamente")
        } else if (response == 400) {
            alert("El usuario ya existe")
        } else {
            alert("Intentelo mas tarde")
        }

    }


    return (
        <div className="container mt-5 ">
            <div className="row justify-content-center ">
                <h1 className="text-center">Register</h1>
                <div className="col-12 col-md-6">
                    <form onSubmit={handleSubmit} className="border-form p-3 mt-3">
                        <div className="form-group mt-3">
                            <label>Name</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Name"
                                name="name"
                                value={user.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label>Email</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="name@email.com"
                                name="email"
                                value={user.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label>Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Password"
                                name="password"
                                value={user.password}
                                onChange={handleChange}
                                required
                                minLength="6"
                            />
                        </div>
                        <button className="btn btn-primary mt-3 w-100">Register</button>
                    </form>
                    <div className="text-center">
                        <p className="m-0">
                            Do You Have an Account? <Link to="/login">Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
