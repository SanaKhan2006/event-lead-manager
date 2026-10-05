from sqlalchemy import Column, Integer, String, Text
from database import Base


class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    company = Column(String)
    email = Column(String)
    event = Column(String)
    notes = Column(Text)
    follow_up_status = Column(String)