
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import config

app = Flask(__name__)
app.config['SECRET_KEY'] = config['SECRET_KEY']
app.config['SQLALCHEMY_DATABASE_URI'] = config['SQLALCHEMY_DATABASE_URI']
db = SQLAlchemy(app)

from flaskblog import routes