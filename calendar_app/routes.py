from flask import render_template, url_for, flash, redirect, request
from calendar_app import application, db
from calendar_app.models import User, Event
from datetime import datetime
from sqlalchemy.orm import load_only
from sqlalchemy import extract  
import json

# home page
@application.route("/home")
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
@application.route("/")
@application.route("/login")
def login():
    return render_template('login.html')

# create new event
@application.route("/create_event", methods=['GET', 'POST'])
def create_event():
    if request.method == 'POST':
        date = request.form.get("date")
        datetime_obj = datetime.strptime(date, '%d-%m-%Y').strftime('%Y-%m-%d')

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

        event_id = request.form.get("eventId")
        print(event_id)
        if not event_id:
            print("in the add section")
            new_event = Event(title=event_title, description=event_description, date=datetime_obj, start=start, end=end, user_id=user_id)
            db.session.add(new_event)
            db.session.commit()
        else: 
            print("in the edit section")
            event_id = request.form.get("eventId")
            event_to_edit = Event.query.filter_by(id=event_id).first()
            print("testing edit")
            print(event_to_edit)
            event_to_edit.title = event_title
            event_to_edit.description = event_description
            event_to_edit.date = datetime_obj
            event_to_edit.start = start
            event_to_edit.end = end
            db.session.commit()
    return '' 


# get users events from database to populate calendar
@application.route("/get_events", methods=['GET', 'POST'])
def get_events():
    # 1. if no date given in request
    # get email, month and year out of request
    
    email = request.args.get("email")
    date = request.args.get("date")
    month = request.args.get("month")
    year = request.args.get("year")

    # get events belonging to user for specific month and year
    user = User.query.filter_by(email=email).first()
    user_id = user.id
    # get array of all users who have shared events with current user 
    users_with_shared_events = User.query.filter(User.shared_with.contains(user)).all()


    # if date not given as argument
    if not date:
        events = Event.query.filter(extract('year', Event.date) == year).filter(extract('month', Event.date) == month).filter_by(user_id = user_id).all()
        # convert events to dict
        all_events = []
        for event in events: 
            all_events.append(event.to_dict())

        # add events belonging to users who have shared their events with current user
        for user in users_with_shared_events:
            events = Event.query.filter(extract('year', Event.date) == year).filter(extract('month', Event.date) == month).filter_by(user_id = user.id).all()
            for event in events: 
                all_events.append(event.to_dict())

        print("all events: ", all_events)
        return json.dumps(all_events)

    # 2. if date given as argument 
    else:
        events = Event.query.filter(extract('year', Event.date) == year).filter(extract('month', Event.date) == month).filter(extract('day', Event.date) == date).filter_by(user_id = user_id).all()
        all_events = []
        for event in events: 
            all_events.append(event.to_dict())


        # add events belonging to users who have shared their events with current user
        for user in users_with_shared_events:
            events = Event.query.filter(extract('year', Event.date) == year).filter(extract('month', Event.date) == month).filter(extract('day', Event.date) == date).filter_by(user_id = user.id).all()
            for event in events: 
                all_events.append(event.to_dict())

        print("with date ", all_events)
        return json.dumps(all_events)


# get users events from database to populate calendar
@application.route("/delete", methods=['GET', 'POST'])
def delete():
    if request.method == 'POST':
        event_id = request.form.get("id")
        print("ID ", event_id)
        event_to_delete = Event.query.filter_by(id=event_id).first()
        db.session.delete(event_to_delete)
        db.session.commit()

        return ''


# share calendar with another user who has has an account on app
@application.route("/share_calendar", methods=['GET', 'POST'])
def share_calendar():
    if request.method == 'POST':
        user_email = request.form.get("email")
        share_email = request.form.get("share_email")
        print(user_email)
        print(share_email)
        share_user = User.query.filter_by(email=share_email).first()
        if share_user is None: 
            return '', 400
        current_user = User.query.filter_by(email=user_email).first()
        current_user.shared_with.append(share_user)
        db.session.commit()
        return '', 200


# search for event
@application.route("/search_event", methods=['GET', 'POST'])
def search_event():
    email = request.args.get("email")
    search = request.args.get("search")
    user = User.query.filter_by(email=email).first()

    all_search_results = []
    # get all events matching search which belong to current user
    search_results = Event.query.filter(Event.title.contains(search)).filter_by(user_id = user.id).all()
    for result in search_results:
        all_search_results.append(result.to_dict())
    
    # get all events matching search which were shared by other users
    users_with_shared_events = User.query.filter(User.shared_with.contains(user)).all()
    for user in users_with_shared_events:
        search_results = Event.query.filter(Event.title.contains(search)).filter_by(user_id = user.id).all()
        for result in search_results:
            all_search_results.append(result.to_dict())
    
    return json.dumps(all_search_results)
