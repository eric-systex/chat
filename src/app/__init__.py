from flask import Flask, render_template, _app_ctx_stack, current_app
from flask_sqlalchemy import SQLAlchemy
from flask_pymongo import PyMongo
from flask_socketio import SocketIO, emit
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_json import FlaskJSON

from config import config
import os, logging

logger = logging.getLogger(__name__)
db = SQLAlchemy()
mongo = PyMongo()
socketio = SocketIO()
jwt = JWTManager()
cors = CORS()
json = FlaskJSON()

def create_app(config_name):
    
    app = Flask(__name__, static_url_path='/chat/static') 
    app.config.from_object(config[config_name]) 

    logger.info("env is %s", config_name.upper())
    
    config[config_name].init_app(app)
    db.init_app(app)
    mongo.init_app(app)
    socketio.init_app(app, path='/chat/socket.io', async_mode='eventlet')
    jwt.init_app(app)
    cors.init_app(app, resources={"/chat/api/*": {"origins": "*"}})
    json.init_app(app)

    session_lifetime = app.permanent_session_lifetime
    logger.info('session_lifetime: %d days' % session_lifetime.days)
    
    # attach routes and custom error pages here
    from .main import main_blueprint
    app.register_blueprint(main_blueprint, url_prefix='/chat')
    
    return app


@json.encoder
def encoder(o):
    from bson.objectid import ObjectId
    if isinstance(o, ObjectId):
        return str(o)
