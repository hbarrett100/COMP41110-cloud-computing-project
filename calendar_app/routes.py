from flask import render_template, url_for, flash, redirect, request
from calendar_app import app, db
from calendar_app.models import User, Event
from datetime import datetime
from sqlalchemy.orm import load_only
from sqlalchemy import extract  
import json

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

# create new event
@app.route("/create_event", methods=['GET', 'POST'])
def create_event():
    print("inside create_event route")
    if request.method == 'POST':
        date = request.form.get("date")
        datetime_obj = datetime.strptime(date, '%d-%m-%Y').strftime('%Y-%m-%d')
        print("date: ", datetime_obj)

        start = request.form.get("startTime")
        start = start + ":00"
        
        end = request.form.get("endTime")
        end = end + ":00"

        event_title = request.form.get("title")
        event_description = request.form.get("description")


        # get id of event creator
        email = request.form.get("email")
        user = User.query.filter_by(email=email).first()
        user_id = user.id
        
        
        new_event = Event(title=event_title, description=event_description, date=datetime_obj, start=start, end=end, user_id=user_id)
        db.session.add(new_event)
        db.session.commit()

        
    return '' 


# get users events from database to populate calendar
@app.route("/get_events", methods=['GET', 'POST'])
def get_events():
    # 1. if no date given in request
    # get email, month and year out of request
    email = request.args.get("email")
    month = request.args.get("month")
    year = request.args.get("year")

    # get events belonging to user for specific month and year
    user = User.query.filter_by(email=email).first()
    user_id = user.id
   
    events = Event.query.filter(extract('year', Event.date) == year).filter(extract('month', Event.date) == month).filter_by(user_id = user_id).all()
    
    # convert events to dict
    all_events = []
    for event in events: 
        all_events.append(event.to_dict())
    print("all events: ", all_events)
    return json.dumps(all_events)


  

    # 2. if date given in request

    # return ' '