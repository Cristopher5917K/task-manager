import React, { useState, useContext } from "react"
import { Context } from "../store/appContext"
import { Link, useNavigate } from "react-router-dom"
import "../../styles/login.css"

const initialUserState={
    email:"",
    password:""
}

const Login =()=>{

const [user,setUser] = useState(initialUserState)
const {actions} = useContext(Context)
const navigate = useNavigate()

const  handleChange =({target})=>{
    setUser({
        ...user,
        [target.name]:target.value
    })
} 

const handleSubmit= async (event)=>{
    try {
        event.preventDefault()
        const response = await actions.login(user)

        if(response == 201){
            navigate("/tasks")
        }
        else if(response == 400){
           alert("Contraseña incorrecta") 
        }
    } catch (error) {
        console.log(error)
    }
}
    return(
        <div className="container">
            <div className="row justify-content-center">
                <h1 className="text-center my-5">Login</h1>
                <div className="col-12 col-md-6">
                    <form
                        className="border-form"
                        onSubmit={handleSubmit}
                    >
                        <div className="form-group">
                            <label htmlFor="">Correo Elecronico</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="nombre@email.com"
                                name="email"
                                value={user.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="">Contraseña</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="contraseña"
                                name="password"
                                value={user.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mt-3">
                            <button className="btn btn-primary w-100">Login</button>
                        </div>
                    </form>
                    <div className="text-center">
                        <p className="m-0">
                            Don't have an account? <Link to={"/register"}>Register</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div >
    )
}
export default Login