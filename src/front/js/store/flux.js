const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			currentUser: null,
			tasks: []
		},
		actions: {
			register: async (user) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/register`, {
						method: "POST",
						body: user
					});
					return response.status;
				} catch (error) {
					console.log(error);
					return 500;  
				}
			},

			login: async (user) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/login`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(user)
					});

					const data = await response.json();
					if (response.ok) {
						setStore({ currentUser: data.user });
						localStorage.setItem("token", data.token); 
					}
					return response.status;
				} catch (error) {
					console.log("Login error:", error);
					return 500;  
				}
			},

			logOut: () => {
				try {
					setStore({ currentUser: null });
					localStorage.removeItem("token");
				} catch (error) {
					console.log("Error en logOut:", error);
				}
			},

			addTask: async (task) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/tasks`, {
						method: "POST",
						headers: {
							"Authorization": `Bearer ${localStorage.getItem("token")}`,
							"Content-Type": "application/json"
						},
						body: JSON.stringify(task)
					});
					return response.status
				} catch (error) {
					console.log("Error adding task:", error);
					return 500;  
				}
			},

			getTasks: async () => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/tasks`, {
						method: "GET",
						headers: {
							"Authorization": `Bearer ${localStorage.getItem("token")}`,
						},
					});
					const data = await response.json();
					if (response.ok) {
						setStore({ tasks: data.tasks || [] });
					}
				} catch (error) {
					console.log("Error fetching tasks:", error);
				}
			},

			editTask: async (update, idTask) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/tasks/${idTask}`, {
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${localStorage.getItem("token")}`
						},
						body: JSON.stringify(update)
					});
					if (response.ok) {
						getActions().getTasks();
						return 200;  
					} else {
						return 400;  
					}
				} catch (error) {
					console.log("Error editing task:", error);
					return 500;  
				}
			},

			deleteTask: async (id) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/tasks/${id}`, {
						method: "DELETE",
						headers: {
							"Authorization": `Bearer ${localStorage.getItem("token")}`
						}
					});
					if (response.ok) {
						getActions().getTasks();
						return "Task deleted"; 
					} else {
						return "Problem deleting task, please try later"; 
					}
				} catch (error) {
					console.log("Error deleting task:", error);
					return 500;  
				}
			}
		}
	};
};

export default getState;
