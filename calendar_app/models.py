from datetime import datetime
from calendar_app import db

# association table for many to many relationship between user and events
shared_events = db.Table('event_association',
    db.Column('event_id', db.Integer, db.ForeignKey('event.id')), 
    db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
    db.UniqueConstraint('event_id', 'user_id', name='unique_shared_events')
)

# association table for many to many relationship between two users
shared_users = db.Table('user_association',
    db.Column('sharing_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('shared_to_id', db.Integer, db.ForeignKey('user.id')),
    db.UniqueConstraint('sharing_id', 'shared_to_id', name='unique_shares')
)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    events = db.relationship(
        "Event",
        secondary=shared_events,
        backref=db.backref('user', lazy=True))

    # shared users
    shared_with = db.relationship(
        'User', 
        secondary=shared_users,
        primaryjoin=id==shared_users.c.sharing_id,
        secondaryjoin=id==shared_users.c.shared_to_id)

    def __init__(self, email):
        self.email = email


    def __repr__(self):
        return f"User('{self.email}')"


class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    date = db.Column(db.Date, nullable=False) 
    start = db.Column(db.Time, nullable=False) 
    end = db.Column(db.Time, nullable=False) 
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f"Post('{self.title}', '{self.description}', '{self.date}', '{self.start}', '{self.end}')"

    def to_dict(self):
        print("Date ==========")
        print(type(self.start))
        d = {'id' : self.id,
        'title' : self.title,
        'description' : self.description, 
        'date': self.date.strftime("%d-%m-%Y"),  
        'start':self.start.strftime("%H:%M"),
        'end':self.end.strftime("%H:%M"),
        }
        return d


# if __name__ == "__main__":
    