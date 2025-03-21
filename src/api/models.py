from flask_sqlalchemy import SQLAlchemy
from enum import Enum

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(180), nullable=False)
    salt = db.Column(db.String(130), nullable=False)

    tasks = db.relationship("Task", back_populates="user", lazy=True)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
        }
    
    def serialize_with_tasks(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "tasks": [task.serialize() for task in self.tasks]
        }

class Importance(Enum):
    HIGH = "High"
    MEDIUM = "Mid"
    LOW = "Low"

class Task(db.Model):
    __tablename__ = "tasks"
    id = db.Column(db.Integer, primary_key=True)
    task = db.Column(db.String(180), nullable=False)
    date = db.Column(db.String(180), nullable=False)
    importance = db.Column(db.Enum(Importance), nullable=False, default=Importance.LOW)

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    user = db.relationship("User", back_populates="tasks")

    def serialize(self):
        return {
            "id": self.id,
            "task": self.task,
            "date": self.date,
            "importance": self.importance.value,  
            "user_id": self.user_id
        }
