from flask import render_template, url_for, flash, redirect
from calendar_app import app
# from calendar.models import User, Post

@app.route("/")
@app.route("/home")
def home():
    return render_template('home.html')


@app.route("/login")
def about():
    return render_template('about.html')