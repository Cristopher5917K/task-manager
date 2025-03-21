"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Task
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import os
from base64 import b64encode
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route("/register", methods=["POST"])
def add_new_user():
    try:
        body=request.json

        name = body.get("name",None)
        email = body.get("email",None)
        password = body.get("password",None)

        if name is None or email is None or password is None:
            return jsonify({"Warning":"Incomplete Credentials"}),401
        else:
            user=User()
            user_exist=User.query.filter_by(email=email).one_or_none()

            if user_exist is not None:
                return jsonify({"Warning":"User Exist"})
            else:
                salt=b64encode(os.urandom(32)).decode("utf-8")
                password=generate_password_hash(f'{password}{salt}')

                user.name=name
                user.email=email
                user.password=password
                user.salt=salt

                db.session.add(user)

                try:
                    db.session.commit()
                    return jsonify("User Create"),200
                except Exception as error:
                    db.session.rollback()
                    return jsonify(f'Error:{error.args}'),500
    except Exception as err:
        return jsonify(f'Error:{err.args}'),500
    
@api.route("/login", methods=["POST"])
def login():
    try:
        body=request.json   
        email=body.get("email", None)
        password=body.get("password", None)

        if email is None or password is None:
            return jsonify({"Warning":"Incomplete Credentials"}),400
        else:
            user=User.query.filter_by(email=email).first()
            if user is None:
                return jsonify({"Warning":"Invalid Credentials"}),401
            else:
                if check_password_hash(user.password,f"{password}{user.salt}"):
                    token=create_access_token(identity=str(user.id))
                    return jsonify(token=token, user=user.serialize()),201
                else:
                    return jsonify({"Warning":"Invalid Credentials"}),401
                    
    except Exception as err:
        return jsonify(f"Error{err.args}"),500
    
@api.route("/tasks", methods=["POST"])
@jwt_required()
def post_tasks():
    try:
        user_id = int(get_jwt_identity())
        body=request.json

        task = body.get("task", None)
        date = body.get("date", None)
        importance = body.get("importance", None)

        if task is None or date is None:
            return({"Warining":"Incomplete Information"}),400
        else:
            tasks = Task()
            tasks.task = task
            tasks.date = date
            tasks.importance = importance
            tasks.user_id = user_id

            try:
                db.session.add(tasks)
                db.session.commit()

                return jsonify(f'Task {task} added'),200
            except Exception as error:
                return jsonify(f'Error: {error}'),500

    except Exception as err:
        return jsonify(f'Error:{err.args}'),500

@api.route("/tasks", methods=["GET"])
@jwt_required()
def get_tasks():

    try:
        user_id = int(get_jwt_identity())
        user = User.query.filter_by(id=user_id).one_or_none()
        
        if user is None:
            return jsonify({"warning":"user Not Found"}),401
        else:
            return jsonify(user.serialize_with_tasks()),200
    except Exception as err:
        return jsonify(f'Error:{err.args}')
        
    
    

