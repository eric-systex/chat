from flask import session, redirect, url_for, request, render_template, Response, jsonify
from flask_socketio import emit, join_room, leave_room
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

from . import main_blueprint as main
from .service import ChatService
from .. import socketio
from ..models import Action
from app.utils import get_current_user, serialize
import logging
from flask_json import json

logger = logging.getLogger(__name__)

@main.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html')

@main.route('/api/login', methods=['POST'])
def login():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    username = request.json.get('username', None)
    password = request.json.get('password', None)
    if not username:
        return jsonify({"msg": "Missing username parameter"}), 400
    if not password:
        return jsonify({"msg": "Missing password parameter"}), 400

    if password != 'test':
        return jsonify({"msg": "Bad username or password"}), 401

    # Identity can be any data that is json serializable
    access_token = create_access_token(identity=username)

    user = ChatService.getUser(username)
    result = {
        "id": user['id'], 
        "name": user['name'], 
        "avatar": user['avatar'],
        "token": access_token
    }

    session['name'] = user['id']
    return jsonify(result), 200

@main.route('/api/contacts', methods=['GET', 'POST'])
@jwt_required
def contacts():
    data = ChatService.getContacts(get_current_user())
    # groups = [row for row in data if row['type'] == 'group']
    # friends = [row for row in data if row['type'] == 'friend']
    return jsonify(data), 200

@main.route('/api/rooms', methods=['GET', 'POST'])
@jwt_required
def rooms():
    data = ChatService.getRooms(get_current_user())
    return jsonify(data), 200

@main.route('/api/room/<roomId>', methods=['GET', 'POST'])
@jwt_required
def room(roomId):
    data = ChatService.getRoom(roomId, get_current_user())
    return jsonify(data), 200

@main.route('/api/room/<roomId>/messages', methods=['GET', 'POST'])
@jwt_required
def messages(roomId):
    data = ChatService.getMessages(roomId)
    return jsonify(data), 200

@main.route('/api/room/add', methods=['PUT'])
@jwt_required
def add_room():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    contactId = request.json.get('id', None)
    contactName = request.json.get('name', None)
    lastMessage = request.json.get('last_message', None)

    room = ChatService.addRoom(get_current_user(), contactId, contactName, lastMessage)
    return jsonify(room), 200

@socketio.on('message', namespace='/chat')
def message(message):
    """Sent by a client when the user entered a new message.
    The message is sent to all people in the room."""
    logger.info(message)
    if message.get('action') == Action.JOINED.value:
        room = message.get('room')
        logger.info('action is JOINED room:%s' % room)
        join_room(room, namespace='/chat')
        emit('message', message, room=room, namespace='/chat')
    elif message.get('action') == Action.LEFT.value:
        room = message.get('room')
        logger.info('action is LEFT room:%s' % room)
        emit('message', message, room=room, namespace='/chat')
        leave_room(room, namespace='/chat')
    else:
        room = message.get('room')
        user = message.get('from')
        content = message.get('content')
        logger.info('this is MESSAGE at room:%s' % room);
        result = ChatService.addMessage(room, user, content)
        if result != None:
            message['last_modified'] = result['last_modified']
            emit('message', message, room=room, namespace='/chat') 

