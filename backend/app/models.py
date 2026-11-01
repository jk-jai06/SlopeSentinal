from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="user")  # "user" or "admin"
    created_at = Column(DateTime, default=datetime.utcnow)
    
    predictions = relationship("Prediction", back_populates="owner", cascade="all, delete-orphan")
    saved_locations = relationship("SavedLocation", back_populates="owner", cascade="all, delete-orphan")

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Input features
    rainfall = Column(Float, nullable=False)
    slope = Column(Float, nullable=False)
    soil_type = Column(String, nullable=False)
    vegetation = Column(Float, nullable=False)
    elevation = Column(Float, nullable=False)
    land_use = Column(String, nullable=False)
    region_name = Column(String, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    
    # Output class and probabilities
    predicted_class = Column(String, nullable=False)
    probability_high = Column(Float, nullable=False)
    probability_medium = Column(Float, nullable=False)
    probability_low = Column(Float, nullable=False)
    
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    owner = relationship("User", back_populates="predictions")

class SavedLocation(Base):
    __tablename__ = "saved_locations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    elevation = Column(Float, nullable=True)
    soil_type = Column(String, nullable=True)
    land_use = Column(String, nullable=True)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="saved_locations")
