from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False) # 'farmer' or 'consumer'
    
    # Profile Details
    email = Column(String, unique=True, index=True, nullable=True)
    phone = Column(String, nullable=True)
    address = Column(String, nullable=True)
    dob = Column(String, nullable=True)
    profile_picture_url = Column(String, nullable=True)
    
    products = relationship("Product", back_populates="farmer")
    orders = relationship("Order", back_populates="consumer")

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(String)
    price = Column(Float, nullable=False)
    quantity = Column(Integer, default=0)
    image_url = Column(String)
    
    farmer_id = Column(Integer, ForeignKey("users.id"))
    farmer = relationship("User", back_populates="products")
    
    order_items = relationship("OrderItem", back_populates="product")

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    consumer_id = Column(Integer, ForeignKey("users.id"))
    total_price = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    consumer = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer, nullable=False)
    price_at_purchase = Column(Float, nullable=False)
    
    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")
