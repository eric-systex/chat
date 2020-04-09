from flask_jwt_extended import get_jwt_identity
from sqlalchemy.orm import class_mapper

def get_current_user():
    user = get_jwt_identity()
    return 'guest' if user == None else user

def serialize(model):
    """Transforms a model into a dictionary which can be dumped to JSON."""
    # first we get the names of all the columns on your model
    columns = [c.key for c in class_mapper(model.__class__).columns]
    # then we return their values in a dict
    return dict((c, getattr(model, c)) for c in columns)

