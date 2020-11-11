from datetime import datetime
from calendar_app import db


association_table = Table('association', Base.metadata,
    Column('event_id', Integer, ForeignKey('event.id')),
    Column('user_id', Integer, ForeignKey('user.id'))
)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    events = relationship(
        "Event",
        secondary=association_table,
        back_populates="User")

    def __repr__(self):
        return f"User('{self.email}')"


class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    # date = db.Column(db.DateTime, nullable=False)
    # start = db.Column(db.DateTime, nullable=False)
    # end = db.Column(db.DateTime, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    events = relationship(
        "User",
        secondary=association_table,
        back_populates="Event")

    def __repr__(self):
        return f"Post('{self.title}', '{self.start}')"
