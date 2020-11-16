from flask import render_template, url_for, flash, redirect, request
from calendar_app import app, db
from calendar_app.models import User, Event

# home page

@app.route("/home")
def home():
    user_email = request.args.get('email') #get email entered in form on login page

    # add user to database if they don't already exist 
    existing_user = User.query.filter_by(email=user_email).first()
    if not existing_user:
        usr = User(email=user_email) 
        db.session.add(usr)
        db.session.commit()
    return render_template('home.html', user_email=user_email)

# login page
@app.route("/")
@app.route("/login")
def login():
    return render_template('login.html')