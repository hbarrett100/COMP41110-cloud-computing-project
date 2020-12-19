from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import config

application = Flask(__name__)
application.config['SECRET_KEY'] = config['SECRET_KEY']
application.config['SQLALCHEMY_DATABASE_URI'] = config['SQLALCHEMY_DATABASE_URI']
application.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(application)

from calendar_app.models import *

db.create_all()
db.session.commit()

from calendar_app import routes