from flask import render_template 
from flask_wtf.csrf import CSRFError
from . import main_blueprint as main

@main.app_errorhandler(403) 
def forbidden(e):
    return render_template('error.html'), 403

@main.app_errorhandler(404) 
def page_not_found(e):
    return render_template('error.html'), 404

@main.app_errorhandler(500) 
def internal_server_error(e):
    return render_template('error.html'), 500

@main.errorhandler(CSRFError)
def csrf_error(e):
    return render_template('error.html', reason=e.description), 400
